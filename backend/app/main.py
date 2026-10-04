import os
import re
import logging
import asyncpg
import fastapi.responses
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

logger = logging.getLogger("seloora")
logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Seloora Beauty API", version="1.0.0", docs_url="/docs", redoc_url="/redoc")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import orders, admin, dashboard
app.include_router(orders.router, prefix="/api")
app.include_router(admin.router)
app.include_router(dashboard.router)


def _db_params():
    raw = os.environ.get("DATABASE_URL", "postgres://selorabeauty:selorabeauty@database:5432/selorabeauty")
    raw = raw.split("?")[0].replace("postgres://", "postgresql://")
    m = re.match(r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", raw)
    if m:
        user, password, host, port, _ = m.groups()
    else:
        user, password, host, port = "selorabeauty", "selorabeauty", "database", "5432"
    return host, int(port), user, password


async def _ensure_tables():
    host, port, user, password = _db_params()
    target_db = "selorabeauty"

    logger.info(f"[startup] host={host} port={port} user={user} target_db={target_db}")

    # Try ALL possible admin databases to find one that works
    admin_dbs = ["postgres", "template1", "selorabeauty", "seloorabeauty", user]
    admin_conn = None
    working_admin_db = None

    for try_db in admin_dbs:
        try:
            c = await asyncpg.connect(
                host=host, port=port, user=user, password=password,
                database=try_db, timeout=5
            )
            await c.close()
            working_admin_db = try_db
            logger.info(f"[startup] ✅ PostgreSQL reachable via db='{try_db}'")
            break
        except asyncpg.InvalidCatalogNameError:
            logger.info(f"[startup] db='{try_db}' does not exist, trying next...")
            continue
        except asyncpg.InvalidPasswordError:
            logger.error(f"[startup] ❌ Wrong password for user='{user}'")
            return
        except Exception as e:
            logger.warning(f"[startup] db='{try_db}' error: {type(e).__name__}: {e}")
            continue

    if working_admin_db is None:
        logger.error("[startup] ❌ Cannot reach PostgreSQL with any known database name!")
        logger.error(f"[startup] Tried: {admin_dbs}")
        return

    # If we found a working db that isn't the target, create target
    if working_admin_db != target_db:
        try:
            admin_conn = await asyncpg.connect(
                host=host, port=port, user=user, password=password,
                database=working_admin_db, timeout=5
            )
            exists = await admin_conn.fetchval("SELECT 1 FROM pg_database WHERE datname=$1", target_db)
            if not exists:
                await admin_conn.execute(f'CREATE DATABASE "{target_db}"')
                logger.info(f"[startup] ✨ Created database '{target_db}'")
            else:
                logger.info(f"[startup] ✅ Database '{target_db}' already exists")
            await admin_conn.close()
        except Exception as e:
            logger.error(f"[startup] ❌ Could not create database: {e}")
            if admin_conn:
                await admin_conn.close()
            return

    # Connect to target and create tables
    try:
        conn = await asyncpg.connect(
            host=host, port=port, user=user, password=password,
            database=target_db, timeout=8
        )
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS orders (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                order_id VARCHAR(50) UNIQUE NOT NULL,
                name VARCHAR(200) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                product_id VARCHAR(100) NOT NULL DEFAULT 'retinal-serum-150ml',
                product_name VARCHAR(200) NOT NULL DEFAULT 'سيروم الريتينال',
                quantity INTEGER NOT NULL DEFAULT 1,
                unit_price NUMERIC(10,2) NOT NULL,
                subtotal NUMERIC(10,2) NOT NULL,
                vat NUMERIC(10,2) NOT NULL DEFAULT 0,
                cod_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
                total NUMERIC(10,2) NOT NULL,
                status VARCHAR(50) NOT NULL DEFAULT 'pending',
                upsell_accepted BOOLEAN DEFAULT false,
                upsell_qty INTEGER DEFAULT 0,
                upsell_total NUMERIC(10,2) DEFAULT 0,
                ttclid VARCHAR(500),
                sc_cid VARCHAR(500),
                event_id VARCHAR(200),
                ip_address VARCHAR(45),
                user_agent TEXT,
                page_url TEXT,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        """)
        await conn.execute("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL PRIMARY KEY)")
        await conn.execute("INSERT INTO alembic_version (version_num) VALUES ('002') ON CONFLICT DO NOTHING")
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS page_views (
                id         BIGSERIAL PRIMARY KEY,
                session_id VARCHAR(64),
                event      VARCHAR(50)  NOT NULL DEFAULT 'pageview',
                page_url   TEXT,
                referrer   TEXT,
                ip_address VARCHAR(45),
                country    VARCHAR(10),
                is_ksa     BOOLEAN DEFAULT FALSE,
                is_vpn     BOOLEAN DEFAULT FALSE,
                user_agent TEXT,
                created_at TIMESTAMP DEFAULT NOW()
            )
        """)
        await conn.execute("CREATE INDEX IF NOT EXISTS idx_pv_created ON page_views (created_at DESC)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS notes TEXT")
        # Pixel/CAPI columns
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS ttclid VARCHAR(500)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS sc_cid VARCHAR(500)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS ttp VARCHAR(500)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS sc_cookie1 VARCHAR(500)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS event_id VARCHAR(200)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45)")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS user_agent TEXT")
        await conn.execute("ALTER TABLE orders ADD COLUMN IF NOT EXISTS page_url TEXT")
        result = await conn.fetchval("SELECT to_regclass('public.orders')")
        logger.info(f"[startup] ✅ Table 'orders' ready: {result}")
        await conn.close()
    except Exception as e:
        logger.error(f"[startup] ❌ Table creation failed: {e}")


@app.on_event("startup")
async def startup():
    logger.info(f"[startup] DATABASE_URL = {os.environ.get('DATABASE_URL', 'NOT SET')}")
    logger.info(f"[startup] TikTok CAPI: {'configured' if settings.TIKTOK_ACCESS_TOKEN and settings.TIKTOK_PIXEL_ID else 'NOT CONFIGURED (set TIKTOK_ACCESS_TOKEN + TIKTOK_PIXEL_ID)'}")
    logger.info(f"[startup] Snap CAPI:   {'configured' if settings.SNAPCHAT_ACCESS_TOKEN and settings.SNAPCHAT_PIXEL_ID else 'NOT CONFIGURED (set SNAPCHAT_ACCESS_TOKEN + SNAPCHAT_PIXEL_ID)'}")
    await _ensure_tables()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "seloora-beauty-api"}




@app.get("/")
async def root():
    return {"message": "Seloora Beauty API", "docs": "/docs"}


@app.get("/admin/orders-legacy", response_class=fastapi.responses.HTMLResponse)
async def admin_orders_legacy():
    return """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Selora Beauty — الطلبات</title>
<style>
  body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
  h1 { color: #333; text-align: center; }
  #count { text-align: center; color: #666; margin-bottom: 16px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,.1); }
  th { background: #222; color: #fff; padding: 10px 8px; font-size: 13px; }
  td { padding: 9px 8px; border-bottom: 1px solid #eee; font-size: 13px; vertical-align: top; }
  tr:hover td { background: #f9f9f9; }
  .badge { padding: 2px 8px; border-radius: 10px; font-size: 11px; }
  .pending { background: #fff3cd; color: #856404; }
  .total { font-weight: bold; color: #198754; }
  #loading { text-align: center; padding: 40px; color: #888; }
</style>
</head>
<body>
<h1>Selora Beauty — الطلبات</h1>
<div id="count"></div>
<div id="loading">جاري التحميل...</div>
<table id="tbl" style="display:none">
  <thead><tr>
    <th>#</th><th>رقم الطلب</th><th>الاسم</th><th>الهاتف</th>
    <th>المدينة</th><th>المنتجات</th><th>الإجمالي</th><th>الحالة</th><th>التاريخ</th>
  </tr></thead>
  <tbody id="tbody"></tbody>
</table>
<script>
fetch('/api/orders').then(r=>r.json()).then(orders=>{
  document.getElementById('loading').style.display='none';
  document.getElementById('tbl').style.display='table';
  document.getElementById('count').textContent = 'إجمالي الطلبات: ' + orders.length;
  const tbody = document.getElementById('tbody');
  orders.forEach((o,i) => {
    const items = (o.items||[]).map(it=>it.name+' x'+it.quantity).join(' / ') || '-';
    const date = o.created_at ? new Date(o.created_at).toLocaleString('ar-SA',{timeZone:'Asia/Riyadh'}) : '-';
    tbody.innerHTML += '<tr>' +
      '<td>'+(i+1)+'</td>' +
      '<td><b>'+o.order_id+'</b></td>' +
      '<td>'+o.name+'</td>' +
      '<td>'+o.phone+'</td>' +
      '<td>'+(o.city||'-')+'</td>' +
      '<td>'+items+'</td>' +
      '<td class="total">'+o.total+' ر.س</td>' +
      '<td><span class="badge pending">'+o.status+'</span></td>' +
      '<td>'+date+'</td>' +
    '</tr>';
  });
}).catch(()=>{ document.getElementById('loading').textContent='فشل تحميل الطلبات'; });
</script>
</body>
</html>"""
