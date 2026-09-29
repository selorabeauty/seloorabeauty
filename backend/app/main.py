import os
import re
import logging
import asyncpg
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

from app.routers import orders
app.include_router(orders.router, prefix="/api")


def _db_params():
    """Parse DATABASE_URL and return connection params as-is."""
    raw = os.environ.get("DATABASE_URL", "postgres://selorabeauty:selorabeauty@database:5432/seloorabeauty")
    raw = raw.split("?")[0].replace("postgres://", "postgresql://")
    m = re.match(r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", raw)
    if m:
        user, password, host, port, dbname = m.groups()
        return host, int(port), user, password, dbname
    return "database", 5432, "selorabeauty", "selorabeauty", "seloorabeauty"


async def _ensure_tables():
    host, port, user, password, dbname = _db_params()
    logger.info(f"[startup] host={host} port={port} user={user} dbname={dbname}")

    # Try connecting — try target DB first, then postgres, then template1
    conn = None
    for try_db in [dbname, "postgres", "template1"]:
        try:
            conn = await asyncpg.connect(host=host, port=port, user=user, password=password, database=try_db, timeout=8)
            logger.info(f"[startup] Connected via db='{try_db}'")
            if try_db != dbname:
                exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname=$1", dbname)
                if not exists:
                    await conn.execute(f'CREATE DATABASE "{dbname}"')
                    logger.info(f"[startup] Created database '{dbname}'")
                await conn.close()
                conn = await asyncpg.connect(host=host, port=port, user=user, password=password, database=dbname, timeout=8)
            break
        except asyncpg.InvalidCatalogNameError:
            if conn:
                await conn.close()
            conn = None
        except Exception as e:
            logger.warning(f"[startup] Could not connect via '{try_db}': {e}")
            if conn:
                await conn.close()
            conn = None

    if conn is None:
        logger.error("[startup] ❌ Cannot connect to PostgreSQL!")
        return

    try:
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
        result = await conn.fetchval("SELECT to_regclass('public.orders')")
        logger.info(f"[startup] ✅ orders table: {result}")
    except Exception as e:
        logger.error(f"[startup] ❌ Table creation failed: {e}")
    finally:
        await conn.close()


@app.on_event("startup")
async def startup():
    db_url = os.environ.get("DATABASE_URL", "NOT SET")
    logger.info(f"[startup] DATABASE_URL = {db_url}")
    await _ensure_tables()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "seloora-beauty-api"}


@app.get("/")
async def root():
    return {"message": "Seloora Beauty API", "docs": "/docs"}
