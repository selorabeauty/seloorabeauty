#!/bin/sh
# Wait for database to be ready, then run migrations and start server

echo "⏳ Waiting for database..."

MAX_RETRIES=30
COUNT=0

until python -c "
import asyncio, asyncpg, os, sys
async def check():
    url = os.environ.get('DATABASE_URL','')
    url = url.replace('postgres://', '').replace('postgresql://', '')
    # parse url: user:pass@host:port/db
    try:
        conn = await asyncpg.connect(dsn='postgresql://' + url.split('?')[0])
        await conn.close()
        print('DB ready')
    except Exception as e:
        print(f'DB not ready: {e}', file=sys.stderr)
        sys.exit(1)
asyncio.run(check())
" 2>/dev/null; do
    COUNT=$((COUNT + 1))
    if [ $COUNT -ge $MAX_RETRIES ]; then
        echo "❌ Database not available after $MAX_RETRIES retries. Starting anyway..."
        break
    fi
    echo "⏳ Database not ready yet... retry $COUNT/$MAX_RETRIES"
    sleep 3
done

echo "✅ Running database migrations..."
alembic upgrade head || echo "⚠️ Migration failed or already up to date"

echo "🚀 Starting Seloora Beauty API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
