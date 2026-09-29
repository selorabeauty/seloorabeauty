#!/bin/sh
set -e

echo "================================================"
echo " Seloora Beauty Backend - Startup"
echo "================================================"

# ── Parse DATABASE_URL ────────────────────────────────────────────────────────
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
    _u="${_u#*/}"
    DB_NAME="${_u%%\?*}"
fi

echo "DB_HOST : $DB_HOST"
echo "DB_PORT : $DB_PORT"
echo "DB_NAME : $DB_NAME"
echo "DB_USER : $DB_USER"
echo "================================================"

# ── Step 1: Wait for PostgreSQL + ensure DB exists ───────────────────────────
echo "[1/4] Waiting for PostgreSQL and ensuring database '$DB_NAME' exists..."

python - "$DB_HOST" "$DB_PORT" "$DB_USER" "$DB_PASS" "$DB_NAME" <<'PYEOF'
import asyncio, asyncpg, sys, time

HOST, PORT, APP_USER, APP_PASS, TARGET_DB = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]

# Possible superuser accounts EasyPanel might use
SUPER_CANDIDATES = [
    (APP_USER,  APP_PASS),
    ("postgres", APP_PASS),
    ("postgres", "postgres"),
    ("postgres", ""),
]

# System databases that always exist (for admin connections)
SYSTEM_DBS = ["postgres", "template1"]

async def wait_for_pg(max_wait=90):
    """Wait until PostgreSQL accepts ANY connection."""
    deadline = time.time() + max_wait
    while time.time() < deadline:
        for user, pw in SUPER_CANDIDATES:
            for sysdb in SYSTEM_DBS:
                try:
                    conn = await asyncpg.connect(host=HOST, port=PORT, user=user, password=pw, database=sysdb, timeout=4)
                    await conn.close()
                    print(f"✅ PostgreSQL reachable as user='{user}' db='{sysdb}'")
                    return user, pw
                except asyncpg.InvalidPasswordError:
                    continue  # wrong password, try next
                except asyncpg.InvalidCatalogNameError:
                    # server is up but this sysdb doesn't exist — try direct target
                    try:
                        conn = await asyncpg.connect(host=HOST, port=PORT, user=user, password=pw, database=TARGET_DB, timeout=4)
                        await conn.close()
                        print(f"✅ Target DB '{TARGET_DB}' already accessible as '{user}'")
                        return user, pw
                    except Exception:
                        continue
                except Exception:
                    continue
        print("⏳ PostgreSQL not ready yet, retrying in 3s...")
        await asyncio.sleep(3)
    print("❌ PostgreSQL did not become ready in time.")
    sys.exit(1)

async def ensure_db(admin_user, admin_pass):
    """Make sure TARGET_DB exists, create it if not."""
    # Try to connect directly first
    try:
        conn = await asyncpg.connect(host=HOST, port=PORT, user=APP_USER, password=APP_PASS, database=TARGET_DB, timeout=5)
        await conn.close()
        print(f"✅ Database '{TARGET_DB}' exists and is accessible")
        return
    except asyncpg.InvalidCatalogNameError:
        print(f"⚠️  Database '{TARGET_DB}' does not exist. Will create it.")
    except asyncpg.InvalidPasswordError:
        print(f"⚠️  App user '{APP_USER}' password rejected on '{TARGET_DB}'. Will try admin.")
    except Exception as e:
        print(f"⚠️  Direct connect to '{TARGET_DB}' failed: {e}. Will try admin.")

    # Connect via admin to create DB and user
    for sysdb in SYSTEM_DBS:
        try:
            conn = await asyncpg.connect(host=HOST, port=PORT, user=admin_user, password=admin_pass, database=sysdb, timeout=5)

            # Create role/user if needed
            role_exists = await conn.fetchval("SELECT 1 FROM pg_roles WHERE rolname = $1", APP_USER)
            if not role_exists:
                await conn.execute(f"CREATE ROLE \"{APP_USER}\" WITH LOGIN PASSWORD '{APP_PASS}'")
                print(f"✨ Created PostgreSQL role '{APP_USER}'")
            else:
                # Make sure password is correct
                await conn.execute(f"ALTER ROLE \"{APP_USER}\" WITH PASSWORD '{APP_PASS}'")

            # Create database if needed
            db_exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = $1", TARGET_DB)
            if not db_exists:
                await conn.execute(f'CREATE DATABASE "{TARGET_DB}" OWNER "{APP_USER}"')
                print(f"✨ Created database '{TARGET_DB}'")
            else:
                # Grant access just in case
                await conn.execute(f'GRANT ALL PRIVILEGES ON DATABASE "{TARGET_DB}" TO "{APP_USER}"')
                print(f"✅ Granted privileges on existing database '{TARGET_DB}' to '{APP_USER}'")

            await conn.close()
            return
        except asyncpg.InvalidCatalogNameError:
            continue
        except Exception as e:
            print(f"   Could not admin via '{sysdb}': {e}")
            continue

    print(f"❌ Could not ensure database '{TARGET_DB}'. Check PostgreSQL service settings in EasyPanel.")
    sys.exit(1)

async def main():
    admin_user, admin_pass = await wait_for_pg()
    await ensure_db(admin_user, admin_pass)

asyncio.run(main())
PYEOF

echo "[1/4] ✅ Database ready."

# ── Step 2: Run Alembic migrations ───────────────────────────────────────────
echo ""
echo "[2/4] Running Alembic migrations..."
export PYTHONPATH=/app

alembic upgrade head
echo "[2/4] ✅ Migrations applied."

# ── Step 3: Verify orders table ──────────────────────────────────────────────
echo ""
echo "[3/4] Verifying 'orders' table..."

python - "$DB_HOST" "$DB_PORT" "$DB_USER" "$DB_PASS" "$DB_NAME" <<'PYEOF'
import asyncio, asyncpg, sys

HOST, PORT, USER, PASS, DB = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4], sys.argv[5]

async def verify():
    conn = await asyncpg.connect(host=HOST, port=PORT, user=USER, password=PASS, database=DB, timeout=5)
    result = await conn.fetchval("SELECT to_regclass('public.orders')")
    await conn.close()
    if result:
        print(f"✅ Table 'orders' confirmed in '{DB}'")
    else:
        print("❌ Table 'orders' NOT FOUND — migrations may have failed silently!")
        sys.exit(1)

asyncio.run(verify())
PYEOF

echo "[3/4] ✅ Schema verified."

# ── Step 4: Start API ─────────────────────────────────────────────────────────
echo ""
echo "[4/4] Starting Seloora Beauty API on 0.0.0.0:8000..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
