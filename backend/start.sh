#!/bin/sh
# Wait for database to be ready, then run migrations and start server

echo "⏳ Waiting for database and ensuring it exists..."

MAX_RETRIES=30
COUNT=0

python_check_and_create="
import asyncio
import asyncpg
import os
import sys
from urllib.parse import urlparse

async def check():
    db_url = os.environ.get('DATABASE_URL','')
    if not db_url:
        print('❌ DATABASE_URL not set')
        sys.exit(1)
    
    standard_url = db_url.replace('postgres://', 'postgresql://')
    parsed = urlparse(standard_url)
    db_name = parsed.path.lstrip('/')
    
    # Try common administrative database 'postgres' as fallback for creation
    base_urls = [
        f'postgresql://{parsed.username}:{parsed.password}@{parsed.hostname}:{parsed.port or 5432}/postgres',
        f'postgresql://{parsed.username}:{parsed.password}@{parsed.hostname}:{parsed.port or 5432}/template1'
    ]

    try:
        # 1. Try connecting to the target database directly
        print(f'🔍 Attempting to connect to database \"{db_name}\"...')
        conn = await asyncpg.connect(dsn=standard_url)
        await conn.close()
        print(f'✅ Database \"{db_name}\" is ready')
        return True
    except asyncpg.InvalidCatalogNameError:
        # 2. Database does not exist, try to create it using base connections
        print(f'⚠️ Database \"{db_name}\" does not exist. Trying to create it...')
        for base_url in base_urls:
            try:
                print(f'⚙️ Connecting to admin DB: {base_url.split("@")[-1]}')
                conn = await asyncpg.connect(dsn=base_url)
                await conn.execute(f'CREATE DATABASE {db_name}')
                await conn.close()
                print(f'✨ Database \"{db_name}\" created successfully!')
                return True
            except Exception as e:
                print(f'❌ Could not create via {base_url.split("/")[-1]}: {e}')
        return False
    except Exception as e:
        print(f'⏳ Database service not ready yet: {e}')
        return False

success = asyncio.run(check())
if not success:
    sys.exit(1)
"

until python -c "$python_check_and_create"; do
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database setup failed after $MAX_RETRIES retries."
        exit 1
    fi
    echo "⏳ Retrying database setup $COUNT/$MAX_RETRIES..."
    sleep 3
done

echo "✅ Running database migrations..."
export PYTHONPATH=.
echo "🔍 Current directory: $(pwd)"
echo "🔍 Python path: $PYTHONPATH"

# Run migrations and capture output
if alembic upgrade head; then
    echo "✨ Migrations completed successfully"
else
    echo "❌ Migrations failed! Trying to initialize alembic if needed..."
    # Fallback: in case of stamp issues
    alembic stamp head
    alembic upgrade head
fi

echo "🚀 Starting Seloora Beauty API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
