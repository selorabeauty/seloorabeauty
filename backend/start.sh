#!/bin/sh
set -e

echo "================================================"
echo " Seloora Beauty Backend - Startup"
echo "================================================"

# ── Write service-account.json from embedded base64 ──────
echo "eyJ0eXBlIjoic2VydmljZV9hY2NvdW50IiwicHJvamVjdF9pZCI6InNlbG9yYS1iZWF1dHkiLCJwcml2YXRlX2tleV9pZCI6ImU0NWJiODBjNTVhMjQ5OGE5YzNkYzAyYTg3YTMzNjZjYjVhMTc0NWIiLCJwcml2YXRlX2tleSI6Ii0tLS0tQkVHSU4gUFJJVkFURSBLRVktLS0tLVxuTUlJRXZnSUJBREFOQmdrcWhraUc5dzBCQVFFRkFBU0NCS2d3Z2dTa0FnRUFBb0lCQVFEQ2g4ZUJtczRoTnE3WlxuY0tvZ1duSWxXNWtObXQ0US8wemQzL3htcU5yc1R0OHM5UWtqOVhoM1M0U1JWaG4wcU9QazJ4emlVdXd3SXZ3bVxualRzUGZOTDVKVnc1VVBWOFgwL0FjRTZPK0pySmJwUUliK3V2MTJBYkMrVkNaNWQxVllzK2hLMnlCWTJQSklqZVxuUjgyOU1PVDIzbXNSeS9ndUdNY21UZFlUOEhFWUdldWZjQkVGdHRSZTlYSlowMkw0MlUyWkNlVzVHbGRGcGJvdlxuSlZSZTkyM3BLdGdueUF3MDNMWWh1bGpNQ3ZGOWpCckVjWTZBZHU5NXJud0pXSFd0N1BXZGhwM21JbWpiWmR6a1xuUVR4dHFmSTFURWNURGI3K2ZjT3lURWxNSWJRNlR4TDl5ejBtalZOOEROWThFSVRJZUwzNyt6Z2FCbnlMSGlaVFxubXQxMkpxRzVBZ01CQUFFQ2dnRUFPbm5mYnFYTzVld090bjFvSHE2aGxucEk4VzZHNTV3ZkNxbGNzYTE3bGNLRlxuMHZsYnhJdnpLUVV4OWhCb1lBUHU4YW91TGhpWU9FWWoveURBU3NFT21HZHpLQ1dlamNNRzhjV3d6OGlLbXhlYVxuOTBoUmxIdk5QNFFkYUE5RTE3Z2QwZTdIV2ZiU1hWK3hwd1AxcERRUTkrYlhUN085U0hvWlQzbmhhd0FCdHlqNVxuVXlzKzhmalRwZkpFVS9kSGVjVUR1bkZ6bWExOXNHUTlVRkJ1VjkyL2lLSXdEdXpaNCs0UHVyN25Na3BsaUJCYlxuTTZFeklVNndGRzJmeHY1ODBPZzhnN2srUG5nZHRxK3k5OXlhYzRXNHFBNlR5R3AzNTFlT01iN3RrUC9JVmRGRVxuNVFraWUxU0trZ3JuWHdIbnBNMHdFdHdjS01ybVJ5TVU0SEFXSXBXQTR3S0JnUURscytJM2N0ODRabXBFUDlEeFxuTTlrNVVVNndLRW0walF2TlJPYTUyZDdDMGRTVUxnbTNzYUhqdjRWUlJmSkhtY29ZekI1MDh2UE5KNzU4N3B3clxueDVJeEZNS0U0enJrUGFiN29nWUNFRlQ1TDBvbmFodDZ0NkVndnBRYzFVMFRBa1BHdkNqVWJWTTY5WTdSMWZOYlxuMk5DQ2IwQUZFSEtGMU1uS3YrQ2lZeW4rd3dLQmdRRFl6UkZmaWQydEdjZEljNXpFMnppZ0RwNGlIaHFnNnBlblxudk5ORUpjRDdhelVzSEFtU083aWRLUWQ2UTNqTEg3VzViek5QeVI3dGZ0dHVEUDJDMFVoOFB1OFNQUWZ2NmtXY1xudzIrSW5jdTlzeFNMcTgxSlUrSUt0QlZUNzZ0VnlMU0JGUHBsTHRjNG9rZ1NQVUZjWXJUOUNlTGtIMXpXK1BLNVxuQUY2RzV1Tk4wd0tCZ0ZtTzJSUmxaVUxJSzRhUW14WnY4TEc0VWNXODczL0Z2bVE2Q1B0TlJ0ME9rcU56ajdaZlxuTzQ5Z2pNb3pTMU0vVXR4NE9TZS8wZTZiSUZuMWJrNWpjVXhSbThYVUVwSUt0NkJFZTdNeVN1OGMwUHl0RWltMlxuanN3RmdobjcwQ0VwTU9PN1dPLzU4QWw4MUVKYitKWkc0b1Q0ZXkxK1RDaUIzbXQraEViTUF3T2hBb0dCQUppZlxuM1VBdDlXSWNTTUFIcS9DbUIvb2Q4Rk5DY0NxaW5Ec1k0bjRTT2dhRlZieUV6SFFuR1BPQzQrRzl5RGJ2VHVhSlxuazB6eTRKUC9mNGk5R21kUzREMmZySHhoZk1uNFdpTmZMcEMxemEzeGVXQk9oVW0vQk4zV0kwR2c4elNFQkJidlxuWnN0K3EwTVNjN3hyWlMwZHpCNXJMRkMraDRSTFk4eTdwdEEva1B2REFvR0JBTTNQcFZoNG0wVS9xbnJUWE95T1xuaDBlVkdPMzFOSG41emZRYjVsbGdEU0F5c0szVkJMUmk2aitIaFVXUnE3aXJNdWZXOHJpOU9zNTRjU09vQzkxT1xuOHJKQlpkRTRhYytVakw4Ty8yNWNhZ3cyOEYzYm1qcnhLN1MzK0t4ZG16U0ZnY1d5aTRBanpudzhmVGNkTXkrZ1xua3pPcVNCL3NlM29KM0MxSk0rNmZWYkcxXG4tLS0tLUVORCBQUklWQVRFIEtFWS0tLS0tXG4iLCJjbGllbnRfZW1haWwiOiJzZWxvcmEtc2hlZXRAc2Vsb3JhLWJlYXV0eS5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsImNsaWVudF9pZCI6IjEwMDE2MTc2MzI2NzgyMDM0MzY0MSIsImF1dGhfdXJpIjoiaHR0cHM6Ly9hY2NvdW50cy5nb29nbGUuY29tL28vb2F1dGgyL2F1dGgiLCJ0b2tlbl91cmkiOiJodHRwczovL29hdXRoMi5nb29nbGVhcGlzLmNvbS90b2tlbiIsImF1dGhfcHJvdmlkZXJfeDUwOV9jZXJ0X3VybCI6Imh0dHBzOi8vd3d3Lmdvb2dsZWFwaXMuY29tL29hdXRoMi92MS9jZXJ0cyIsImNsaWVudF94NTA5X2NlcnRfdXJsIjoiaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcm9ib3QvdjEvbWV0YWRhdGEveDUwOS9zZWxvcmEtc2hlZXQlNDBzZWxvcmEtYmVhdXR5LmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidW5pdmVyc2VfZG9tYWluIjoiZ29vZ2xlYXBpcy5jb20ifQ==" | base64 -d > /app/service-account.json
echo "[SA] service-account.json written"

# ── Set Google Sheets env vars from the JSON ─────────────
export GOOGLE_SPREADSHEET_ID="1MryK9DrpLRKQ2PeIf2jc160_WhRVNGqzrACnwou54q8"
export GOOGLE_SA_CLIENT_EMAIL="selora-sheet@selora-beauty.iam.gserviceaccount.com"
export GOOGLE_SA_PRIVATE_KEY_ID="e45bb80c55a2498a9c3dc02a87a3366cb5a1745b"
export GOOGLE_SA_CLIENT_ID="100161763267820343641"

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
