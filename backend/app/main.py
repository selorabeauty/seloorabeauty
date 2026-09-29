import os
import re
import logging
import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

logger = logging.getLogger("seloora")
logging.basicConfig(level=logging.INFO)

app = FastAPI(
    title="Seloora Beauty API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.CORS_ORIGINS.split(",")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.routers import orders
app.include_router(orders.router, prefix="/api")


def _parse_db_params():
    """Parse DB connection params, always forcing DB name to selorabeauty."""
    raw = os.environ.get("DATABASE_URL", "postgres://selorabeauty:selorabeauty@database:5432/selorabeauty")
    raw = raw.split("?")[0]
    raw = raw.replace("postgres://", "postgresql://").replace("postgresql://", "postgresql://")

    # Extract parts manually to avoid urlparse issues with special chars in password
    # Format: postgresql://user:pass@host:port/dbname
    match = re.match(r"postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/(.+)", raw)
    if match:
        user, password, host, port, dbname = match.groups()
    else:
        user, password, host, port, dbname = "selorabeauty", "selorabeauty", "database", "5432", "selorabeauty"

    # ALWAYS force correct DB name regardless of what DATABASE_URL says
    dbname = "selorabeauty"

    logger.info(f"[DB] host={host} port={port} user={user} dbname={dbname}")
    return host, int(port), user, password, dbname


async def _ensure_db_and_tables():
    host, port, user, password, dbname = _parse_db_params()

    logger.info(f"🔍 Connecting to PostgreSQL at {host}:{port}, DB={dbname}")

    # Step 1: Try to connect to target DB directly
    conn = None
    for try_db in [dbname, "postgres", "template1"]:
        try:
            conn = await asyncpg.connect(
                host=host, port=port, user=user, password=password,
                database=try_db, timeout=8
            )
            logger.info(f"✅ Connected via database='{try_db}'")
            if try_db != dbname:
                # Create target DB if missing
                exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname=$1", dbname)
                if not exists:
                    await conn.execute(f'CREATE DATABASE "{dbname}"')
                    logger.info(f"✨ Created database '{dbname}'")
                else:
                    logger.info(f"✅ Database '{dbname}' already exists")
                await conn.close()
                # Now connect to the actual target DB
                conn = await asyncpg.connect(
                    host=host, port=port, user=user, password=password,
                    database=dbname, timeout=8
                )
            break
        except asyncpg.InvalidCatalogNameError:
            if conn:
                await conn.close()
            conn = None
            continue
        except Exception as e:
            logger.warning(f"Could not connect via '{try_db}': {e}")
            if conn:
                await conn.close()
            conn = None
            continue

    if conn is None:
        logger.error("❌ Could not connect to PostgreSQL at all!")
        return

    # Step 2: Create orders table
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
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS alembic_version (
                version_num VARCHAR(32) NOT NULL PRIMARY KEY
            )
        """)
        await conn.execute("""
            INSERT INTO alembic_version (version_num) VALUES ('002')
            ON CONFLICT DO NOTHING
        """)
        result = await conn.fetchval("SELECT to_regclass('public.orders')")
        logger.info(f"✅ Table 'orders' confirmed: {result}")
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
    finally:
        await conn.close()


@app.on_event("startup")
async def startup():
    raw_url = os.environ.get("DATABASE_URL", "NOT SET")
    logger.info(f"DATABASE_URL from environment: {raw_url}")
    await _ensure_db_and_tables()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "seloora-beauty-api"}


@app.get("/")
async def root():
    return {"message": "Seloora Beauty API", "docs": "/docs"}
