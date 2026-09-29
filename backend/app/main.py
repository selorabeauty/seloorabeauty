import logging
import asyncpg
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import orders

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

app.include_router(orders.router, prefix="/api")


async def _ensure_db_and_tables():
    """Create the database and orders table if they don't exist."""
    from urllib.parse import urlparse

    raw = settings.DATABASE_URL.split("?")[0]
    parsed = urlparse(raw.replace("postgres://", "postgresql://"))
    host = parsed.hostname
    port = parsed.port or 5432
    user = parsed.username
    password = parsed.password
    dbname = parsed.path.lstrip("/")

    logger.info(f"🔍 Ensuring database '{dbname}' and tables exist...")

    # Try to connect; if DB missing, create it via postgres/template1
    for attempt_db in [dbname, "postgres", "template1"]:
        try:
            conn = await asyncpg.connect(
                host=host, port=port, user=user, password=password,
                database=attempt_db, timeout=5
            )
            if attempt_db != dbname:
                # We're on an admin DB — create target DB
                exists = await conn.fetchval(
                    "SELECT 1 FROM pg_database WHERE datname=$1", dbname
                )
                if not exists:
                    await conn.execute(f'CREATE DATABASE "{dbname}"')
                    logger.info(f"✨ Created database '{dbname}'")
                else:
                    logger.info(f"✅ Database '{dbname}' already exists")
            await conn.close()
            break
        except asyncpg.InvalidCatalogNameError:
            continue
        except Exception as e:
            logger.warning(f"Could not connect via '{attempt_db}': {e}")
            continue

    # Now connect to target DB and create tables directly via SQL
    try:
        conn = await asyncpg.connect(
            host=host, port=port, user=user, password=password,
            database=dbname, timeout=10
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
        # Also insert alembic_version so alembic thinks it's up to date
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS alembic_version (
                version_num VARCHAR(32) NOT NULL PRIMARY KEY
            )
        """)
        await conn.execute("""
            INSERT INTO alembic_version (version_num)
            VALUES ('002')
            ON CONFLICT DO NOTHING
        """)
        await conn.close()
        logger.info("✅ Table 'orders' is ready.")
    except Exception as e:
        logger.error(f"❌ Failed to create tables: {e}")
        raise


@app.on_event("startup")
async def startup():
    await _ensure_db_and_tables()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "seloora-beauty-api"}


@app.get("/")
async def root():
    return {"message": "Seloora Beauty API", "docs": "/docs"}
