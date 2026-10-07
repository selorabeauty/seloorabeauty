import asyncio
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.order import OrderCreate, OrderResponse, UpsellRequest, UpsellResponse
from app.services import order_service
from app.services.tracking import record_event
from app.services.tiktok_capi import fire_tiktok_event
from app.services.snapchat_capi import fire_snap_event
from app.services import tiktok_capi, snapchat_capi

router = APIRouter(tags=["orders"])

# Events mirrored server-side to CAPI (deduped vs browser via shared event_id).
# 'purchase' is intentionally excluded — it fires from the order itself.
FUNNEL_EVENTS = {"view_content", "add_to_cart", "checkout_start", "pageview"}


@router.post("/track")
async def track_event(request: Request, db: AsyncSession = Depends(get_db)):
    try:
        body       = await request.json()
        ip         = request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or str(request.client.host)
        session_id = body.get("session_id", "")
        event      = body.get("event", "pageview")
        page_url   = body.get("page_url", "")
        referrer   = body.get("referrer", "")
        user_agent = request.headers.get("User-Agent", "")
        await record_event(db, event, ip, session_id, page_url, referrer, user_agent)

        # Mirror funnel events to CAPI — survives ad blockers, deduped by event_id
        if event in FUNNEL_EVENTS:
            event_id  = body.get("event_id") or ""
            click_ids = {
                "ttclid":    body.get("ttclid"),
                "ttp":       body.get("ttp"),
                "sc_cid":    body.get("sc_cid"),
                "sc_cookie1": body.get("sc_cookie1"),
            }
            value      = body.get("value")
            product_id = body.get("product_id")
            asyncio.create_task(fire_tiktok_event(event, event_id, click_ids, ip, user_agent, page_url, value, product_id))
            asyncio.create_task(fire_snap_event(event, event_id, click_ids, ip, user_agent, page_url, value, product_id))
        return {"ok": True}
    except Exception:
        return {"ok": False}


@router.get("/debug/pixels")
async def debug_pixels():
    """Fires one synthetic event to each CAPI and returns the platforms'
    real responses — surfaces token/payload errors without log access."""
    return {
        "tiktok": await tiktok_capi.diagnose(),
        "snapchat": await snapchat_capi.diagnose(),
    }


@router.post("/orders", response_model=OrderResponse)
async def create_order(
    payload: OrderCreate,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    data = payload.model_dump()
    # Prefer real client IP + UA from headers (needed for CAPI match quality)
    data["ip"] = data.get("ip") or request.headers.get("X-Forwarded-For", "").split(",")[0].strip() or str(request.client.host)
    data["user_agent"] = data.get("user_agent") or request.headers.get("User-Agent", "")
    order = await order_service.create_order(db, data)
    return OrderResponse(order_id=order.order_id, total=float(order.total), status=order.status)


@router.post("/orders/upsell", response_model=UpsellResponse)
async def accept_upsell(
    payload: UpsellRequest,
    db: AsyncSession = Depends(get_db),
):
    if not payload.accepted:
        return UpsellResponse(order_id=payload.order_id, upsell_total=0, new_total=0)
    try:
        order = await order_service.accept_upsell(db, payload.order_id, payload.quantity)
        return UpsellResponse(
            order_id=order.order_id,
            upsell_total=float(order.upsell_total),
            new_total=float(order.total),
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/orders")
async def list_orders(db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select, desc
    from app.models.order import Order
    result = await db.execute(select(Order).order_by(desc(Order.created_at)).limit(200))
    orders = result.scalars().all()
    return [
        {
            "order_id":      o.order_id,
            "name":          o.name,
            "phone":         o.phone,
            "city":          o.city,
            "address":       o.address,
            "items":         o.items,
            "total":         float(o.total),
            "status":        o.status,
            "payment":       o.payment_method,
            "created_at":    o.created_at.isoformat() if o.created_at else None,
        }
        for o in orders
    ]


@router.get("/orders/{order_id}")
async def get_order(order_id: str, db: AsyncSession = Depends(get_db)):
    from sqlalchemy import select
    from app.models.order import Order
    result = await db.execute(select(Order).where(Order.order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"order_id": order.order_id, "name": order.name, "phone": order.phone,
            "city": order.city, "address": order.address, "items": order.items,
            "total": float(order.total), "status": order.status, "created_at": order.created_at.isoformat() if order.created_at else None}
