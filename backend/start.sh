#!/bin/sh
set -e

echo "================================================"
echo " Seloora Beauty Backend - Startup"
echo "================================================"

DB_HOST="database"
DB_PORT="5432"
DB_NAME="selorabeauty"
DB_USER="selorabeauty"
DB_PASS="selorabeauty"

if [ -n "$DATABASE_URL" ]; then
    _u="${DATABASE_URL#*://}"
    DB_USER="${_u%%:*}"
    _u="${_u#*:}"
    DB_PASS="${_u%%@*}"
    _u="${_u#*@}"
    DB_HOST="${_u%%:*}"
    _u="${_u#*:}"
    DB_PORT="${_u%%/*}"
    DB_NAME="selorabeauty"
fi

echo "DB_HOST : $DB_HOST"
echo "DB_PORT : $DB_PORT"
echo "DB_NAME : $DB_NAME"
echo "DB_USER : $DB_USER"
echo "================================================"

echo "[1/3] Waiting for PostgreSQL and creating tables..."

python - <<PYEOF
import asyncio, asyncpg, sys

HOST, PORT, USER, PASS, DB = "$DB_HOST", $DB_PORT, "$DB_USER", "$DB_PASS", "$DB_NAME"

CREATE_ORDERS = """
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    city VARCHAR(200),
    district VARCHAR(200),
    address TEXT,
    payment_method VARCHAR(50) DEFAULT 'cod',
    product_id VARCHAR(100) NOT NULL DEFAULT 'retinal-serum-150ml',
    product_name VARCHAR(200) NOT NULL DEFAULT 'serum',
    items JSON,
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
"""

ALTER_ORDERS = [
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS city VARCHAR(200)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS district VARCHAR(200)",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50) DEFAULT 'cod'",
    "ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSON",
]

async def main():
    # Step 1: wait for postgres and ensure DB exists
    for attempt in range(30):
        for try_db in [DB, "postgres", "template1"]:
            try:
                conn = await asyncpg.connect(host=HOST, port=PORT, user=USER, password=PASS, database=try_db, timeout=5)
                print(f"✅ Connected via db='{try_db}'")
                if try_db != DB:
                    exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname=\$1", DB)
                    if not exists:
                        await conn.execute(f'CREATE DATABASE "{DB}"')
                        print(f"✨ Created database '{DB}'")
                    else:
                        print(f"✅ Database '{DB}' exists")
                    await conn.close()
                    conn = await asyncpg.connect(host=HOST, port=PORT, user=USER, password=PASS, database=DB, timeout=5)
                
                # Create tables
                await conn.execute(CREATE_ORDERS)
                # Add any missing columns to existing table
                for alter_sql in ALTER_ORDERS:
                    try:
                        await conn.execute(alter_sql)
                    except Exception as ae:
                        print(f"  (alter skipped: {ae})")
                await conn.execute("CREATE TABLE IF NOT EXISTS alembic_version (version_num VARCHAR(32) NOT NULL PRIMARY KEY)")
                await conn.execute("INSERT INTO alembic_version (version_num) VALUES ('002') ON CONFLICT DO NOTHING")
                result = await conn.fetchval("SELECT to_regclass('public.orders')")
                print(f"✅ Table 'orders' confirmed: {result}")
                await conn.close()
                return True
            except asyncpg.InvalidCatalogNameError:
                continue
            except asyncpg.InvalidPasswordError as e:
                print(f"❌ Wrong password: {e}")
                sys.exit(1)
            except Exception as e:
                print(f"⏳ Attempt {attempt+1}/30 - {type(e).__name__}: {e}")
                break
        import time; time.sleep(3)
    
    print("❌ Could not connect to PostgreSQL after 30 attempts")
    sys.exit(1)

asyncio.run(main())
PYEOF

echo "[2/3] ✅ Database and tables ready."
echo ""
echo "[3/3] Starting Seloora Beauty API..."
export PYTHONPATH=/app
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
