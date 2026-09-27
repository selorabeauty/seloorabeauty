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
    
    # Standardize url for urlparse (asyncpg uses postgresql://)
    standard_url = db_url.replace('postgres://', 'postgresql://')
    parsed = urlparse(standard_url)
    
    db_name = parsed.path.lstrip('/')
    # Connection string to the 'postgres' default database to create our target db
    base_url = f'postgresql://{parsed.username}:{parsed.password}@{parsed.hostname}:{parsed.port or 5432}/postgres'

    try:
        # 1. Try connecting to the actual database
        conn = await asyncpg.connect(dsn=standard_url)
        await conn.close()
        print(f'✅ Database \"{db_name}\" is ready')
        return True
    except asyncpg.InvalidCatalogNameError:
        # 2. Database does not exist, try to create it
        print(f'⚠️ Database \"{db_name}\" does not exist. Attempting to create...')
        try:
            conn = await asyncpg.connect(dsn=base_url)
            await conn.execute(f'CREATE DATABASE {db_name}')
            await conn.close()
            print(f'✨ Database \"{db_name}\" created successfully')
            return True
        except Exception as e:
            print(f'❌ Failed to create database: {e}')
            return False
    except Exception as e:
        print(f'⏳ DB not ready yet: {e}')
        return False

success = asyncio.run(check())
if not success:
    sys.exit(1)
"

until python -c "$python_check_and_create" 2>/dev/null; do
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database setup failed after $MAX_RETRIES retries."
        break
    fi
    echo "⏳ Retrying database setup $COUNT/$MAX_RETRIES..."
    sleep 3
done

echo "✅ Running database migrations..."
alembic upgrade head || echo "⚠️ Migration failed or already up to date"

echo "🚀 Starting Seloora Beauty API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
