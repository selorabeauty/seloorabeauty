"""
Admin API — protected by HTTP Basic Auth (ADMIN_USER / ADMIN_PASSWORD env vars).
All analytics only count KSA IPs that are not VPN/proxy.
"""
import secrets
from datetime import date, timedelta, datetime
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.security import HTTPBasic, HTTPBasicCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.database import get_db
from app.config import settings

router  = APIRouter(prefix="/admin", tags=["admin"])
security = HTTPBasic()


def _auth(credentials: HTTPBasicCredentials = Depends(security)):
    ok_user = secrets.compare_digest(
        credentials.username.encode(), (settings.ADMIN_USER or "admin").encode()
    )
    ok_pass = secrets.compare_digest(
        credentials.password.encode(), (settings.ADMIN_PASSWORD or "changeme").encode()
    )
    if not (ok_user and ok_pass):
        raise HTTPException(
            status_code=401,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )


# ── helpers ──────────────────────────────────────────────────────

def _date_filter(col: str, start: date, end: date) -> str:
    return f"{col} >= '{start}'::date AND {col} < '{(end + timedelta(days=1))}'::date"


# ── METRICS ──────────────────────────────────────────────────────

@router.get("/metrics")
async def metrics(
    start: Optional[date] = Query(default=None),
    end:   Optional[date] = Query(default=None),
    db: AsyncSession = Depends(get_db),
    _=Depends(_auth),
):
    today = date.today()
    start = start or (today - timedelta(days=29))
    end   = end   or today

    df_pv  = _date_filter("pv.created_at", start, end)
    df_ord = _date_filter("o.created_at",  start, end)

    # Unique valid sessions (KSA, not VPN)
    visits_q = await db.execute(text(f"""
        SELECT COUNT(DISTINCT session_id)
        FROM page_views pv
        WHERE {df_pv} AND is_ksa = TRUE AND is_vpn = FALSE
    """))
    visits = visits_q.scalar() or 0

    # Add-to-cart events (KSA, not VPN)
    atc_q = await db.execute(text(f"""
        SELECT COUNT(*)
        FROM page_views pv
        WHERE {df_pv} AND event = 'add_to_cart' AND is_ksa = TRUE AND is_vpn = FALSE
    """))
    add_to_cart = atc_q.scalar() or 0

    # Checkout starts
    co_q = await db.execute(text(f"""
        SELECT COUNT(*)
        FROM page_views pv
        WHERE {df_pv} AND event = 'checkout_start' AND is_ksa = TRUE AND is_vpn = FALSE
    """))
    checkout_starts = co_q.scalar() or 0

    # Orders
    ord_q = await db.execute(text(f"""
        SELECT COUNT(*), COALESCE(SUM(o.total),0)
        FROM orders o
        WHERE {df_ord}
    """))
    row = ord_q.fetchone()
    order_count   = row[0] or 0
    revenue       = float(row[1] or 0)

    # Upsells
    up_q = await db.execute(text(f"""
        SELECT COUNT(*), COALESCE(SUM(upsell_total),0)
        FROM orders o
        WHERE {df_ord} AND upsell_accepted = TRUE
    """))
    up_row       = up_q.fetchone()
    upsell_count = up_row[0] or 0
    upsell_rev   = float(up_row[1] or 0)

    # Daily chart (visits + orders)
    chart_q = await db.execute(text(f"""
        SELECT d.day,
               COALESCE(v.visits, 0)   AS visits,
               COALESCE(o.orders, 0)   AS orders,
               COALESCE(o.revenue, 0)  AS revenue
        FROM (
            SELECT generate_series('{start}'::date, '{end}'::date, '1 day'::interval)::date AS day
        ) d
        LEFT JOIN (
            SELECT DATE(created_at) AS day, COUNT(DISTINCT session_id) AS visits
            FROM page_views
            WHERE is_ksa = TRUE AND is_vpn = FALSE
            GROUP BY 1
        ) v ON v.day = d.day
        LEFT JOIN (
            SELECT DATE(created_at) AS day, COUNT(*) AS orders, SUM(total) AS revenue
            FROM orders
            GROUP BY 1
        ) o ON o.day = d.day
        ORDER BY d.day
    """))
    chart = [
        {"date": str(r[0]), "visits": r[1], "orders": r[2], "revenue": float(r[3])}
        for r in chart_q.fetchall()
    ]

    # City breakdown (from orders)
    city_q = await db.execute(text(f"""
        SELECT city, COUNT(*) AS cnt
        FROM orders o
        WHERE {df_ord} AND city IS NOT NULL
        GROUP BY city ORDER BY cnt DESC LIMIT 10
    """))
    cities = [{"city": r[0], "orders": r[1]} for r in city_q.fetchall()]

    conversion = round(order_count / visits * 100, 2) if visits else 0
    atc_rate   = round(add_to_cart / visits * 100, 2) if visits else 0

    return {
        "period":          {"start": str(start), "end": str(end)},
        "visits":          visits,
        "add_to_cart":     add_to_cart,
        "atc_rate":        atc_rate,
        "checkout_starts": checkout_starts,
        "orders":          order_count,
        "revenue":         revenue,
        "conversion_rate": conversion,
        "aov":             round(revenue / order_count, 2) if order_count else 0,
        "upsells":         upsell_count,
        "upsell_revenue":  upsell_rev,
        "chart":           chart,
        "cities":          cities,
    }


# ── ORDERS LIST ──────────────────────────────────────────────────

@router.get("/orders")
async def list_orders(
    start:  Optional[date] = Query(default=None),
    end:    Optional[date] = Query(default=None),
    status: Optional[str]  = Query(default=None),
    search: Optional[str]  = Query(default=None),
    page:   int            = Query(default=1, ge=1),
    limit:  int            = Query(default=50, le=200),
    db: AsyncSession = Depends(get_db),
    _=Depends(_auth),
):
    today = date.today()
    start = start or (today - timedelta(days=29))
    end   = end   or today

    where = [f"DATE(created_at) >= '{start}' AND DATE(created_at) <= '{end}'"]
    if status:
        where.append(f"status = '{status}'")
    if search:
        s = search.replace("'", "''")
        where.append(f"(order_id ILIKE '%{s}%' OR name ILIKE '%{s}%' OR phone ILIKE '%{s}%')")

    where_sql = " AND ".join(where)
    offset    = (page - 1) * limit

    total_q = await db.execute(text(f"SELECT COUNT(*) FROM orders WHERE {where_sql}"))
    total   = total_q.scalar() or 0

    rows_q = await db.execute(text(f"""
        SELECT order_id, name, phone, city, address, items, total,
               upsell_accepted, upsell_total, status, payment_method, created_at
        FROM orders
        WHERE {where_sql}
        ORDER BY created_at DESC
        LIMIT {limit} OFFSET {offset}
    """))

    orders = []
    for r in rows_q.fetchall():
        import json as _json
        items = r[5]
        if isinstance(items, str):
            try: items = _json.loads(items)
            except: items = []
        orders.append({
            "order_id":       r[0],
            "name":           r[1],
            "phone":          r[2],
            "city":           r[3],
            "address":        r[4],
            "items":          items or [],
            "total":          float(r[6]),
            "upsell":         r[7],
            "upsell_total":   float(r[8] or 0),
            "status":         r[9],
            "payment":        r[10],
            "created_at":     r[11].isoformat() if r[11] else None,
        })

    return {"total": total, "page": page, "limit": limit, "orders": orders}


# ── UPDATE ORDER STATUS ───────────────────────────────────────────

@router.patch("/orders/{order_id}")
async def update_order(
    order_id: str,
    body: dict,
    db: AsyncSession = Depends(get_db),
    _=Depends(_auth),
):
    allowed = {"status", "notes"}
    updates = {k: v for k, v in body.items() if k in allowed}
    if not updates:
        raise HTTPException(400, "Nothing to update")

    set_parts = ", ".join(f"{k} = :{k}" for k in updates)
    updates["order_id"] = order_id
    await db.execute(
        text(f"UPDATE orders SET {set_parts}, updated_at = NOW() WHERE order_id = :order_id"),
        updates,
    )
    await db.commit()
    return {"ok": True}
