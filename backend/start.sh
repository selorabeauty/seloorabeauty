#!/bin/sh
# Wait for database to be ready, then run migrations and start server

echo "⏳ Waiting for PostgreSQL to be ready and ensuring database exists..."

DB_HOST="database"
DB_PORT="5432"
DB_NAME="selorabeauty"
DB_USER="selorabeauty"
DB_PASS="selorabeauty"

# Override from DATABASE_URL if set
if [ -n "$DATABASE_URL" ]; then
    # Extract components from DATABASE_URL
    # Format: postgres://user:pass@host:port/dbname?params
    _url="${DATABASE_URL#postgres://}"
    _url="${_url#postgresql://}"
    DB_USER="${_url%%:*}"
    _rest="${_url#*:}"
    DB_PASS="${_rest%%@*}"
    _rest="${_rest#*@}"
    DB_HOST="${_rest%%:*}"
    _rest="${_rest#*:}"
    DB_PORT="${_rest%%/*}"
    _rest="${_rest#*/}"
    DB_NAME="${_rest%%\?*}"
fi

echo "🔍 DB_HOST=$DB_HOST DB_PORT=$DB_PORT DB_NAME=$DB_NAME DB_USER=$DB_USER"

MAX_RETRIES=30
COUNT=0

# Step 1: Wait for PostgreSQL to accept connections at all
until python - <<EOF
import asyncio, asyncpg, sys

async def ping():
    try:
        # Try postgres superuser database first (always exists)
        conn = await asyncpg.connect(
            host="$DB_HOST",
            port=$DB_PORT,
            user="$DB_USER",
            password="$DB_PASS",
            database="postgres",
            timeout=5
        )
        await conn.close()
        print("✅ PostgreSQL is reachable")
        return True
    except asyncpg.InvalidCatalogNameError:
        # 'postgres' db doesn't exist but server is up — that's fine
        print("✅ PostgreSQL is reachable (no 'postgres' db, that's ok)")
        return True
    except Exception as e:
        print(f"⏳ PostgreSQL not ready: {e}")
        return False

sys.exit(0 if asyncio.run(ping()) else 1)
EOF
do
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ PostgreSQL did not become ready after $MAX_RETRIES retries."
        exit 1
    fi
    echo "⏳ Waiting for PostgreSQL... attempt $COUNT/$MAX_RETRIES"
    sleep 3
done

# Step 2: Ensure target database exists
python - <<EOF
import asyncio, asyncpg, sys

TARGET_DB = "$DB_NAME"
HOST = "$DB_HOST"
PORT = $DB_PORT
USER = "$DB_USER"
PASS = "$DB_PASS"

# Databases to try for admin connection (in order)
ADMIN_DBS = ["postgres", "template1", TARGET_DB]

async def ensure_db():
    # First try connecting directly to target
    try:
        conn = await asyncpg.connect(host=HOST, port=PORT, user=USER, password=PASS, database=TARGET_DB, timeout=5)
        await conn.close()
        print(f"✅ Database '{TARGET_DB}' already exists and is accessible")
        return True
    except asyncpg.InvalidCatalogNameError:
        print(f"⚠️  Database '{TARGET_DB}' does not exist. Creating it...")
    except Exception as e:
        print(f"❌ Cannot connect to '{TARGET_DB}': {e}")
        sys.exit(1)

    # Try admin connection to create the database
    for admin_db in ADMIN_DBS:
        try:
            print(f"⚙️  Connecting to admin database '{admin_db}'...")
            conn = await asyncpg.connect(host=HOST, port=PORT, user=USER, password=PASS, database=admin_db, timeout=5)
            # Check if DB already exists (race condition safety)
            exists = await conn.fetchval("SELECT 1 FROM pg_database WHERE datname = \$1", TARGET_DB)
            if exists:
                print(f"✅ Database '{TARGET_DB}' already exists")
            else:
                await conn.execute(f'CREATE DATABASE "{TARGET_DB}"')
                print(f"✨ Database '{TARGET_DB}' created successfully!")
            await conn.close()
            return True
        except asyncpg.InvalidCatalogNameError:
            print(f"   Admin DB '{admin_db}' also doesn't exist, trying next...")
            continue
        except Exception as e:
            print(f"   Could not use '{admin_db}': {e}")
            continue

    print(f"❌ Could not create database '{TARGET_DB}'. Check PostgreSQL user permissions.")
    sys.exit(1)

asyncio.run(ensure_db())
EOF

if [ $? -ne 0 ]; then
    echo "❌ Database setup failed. Exiting."
    exit 1
fi

# Step 3: Run Alembic migrations
echo ""
echo "✅ Running Alembic migrations..."
export PYTHONPATH=/app

echo "🔍 Working directory: $(pwd)"
echo "🔍 PYTHONPATH: $PYTHONPATH"
echo "🔍 DATABASE_URL: $DATABASE_URL"

alembic upgrade head
MIGRATION_EXIT=$?

if [ $MIGRATION_EXIT -ne 0 ]; then
    echo "❌ alembic upgrade head failed with exit code $MIGRATION_EXIT"
    echo "   Dumping alembic current state for diagnosis:"
    alembic current || true
    echo "   Dumping alembic heads:"
    alembic heads || true
    exit 1
fi

echo "✨ Migrations applied successfully."

# Verify orders table exists
python - <<EOF
import asyncio, asyncpg, sys

async def verify():
    try:
        conn = await asyncpg.connect(
            host="$DB_HOST",
            port=$DB_PORT,
            user="$DB_USER",
            password="$DB_PASS",
            database="$DB_NAME",
            timeout=5
        )
        result = await conn.fetchval("SELECT to_regclass('public.orders')")
        await conn.close()
        if result:
            print(f"✅ Table 'orders' confirmed in database '$DB_NAME'")
        else:
            print("❌ Table 'orders' NOT FOUND after migrations!")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Could not verify orders table: {e}")
        sys.exit(1)

asyncio.run(verify())
EOF

if [ $? -ne 0 ]; then
    echo "❌ Orders table verification failed. The API will not start."
    exit 1
fi

# Step 4: Start the API
echo ""
echo "🚀 Starting Seloora Beauty API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
