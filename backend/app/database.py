import os
import re
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase


def _get_db_url() -> str:
    """
    Always connect to the correct database.
    Parse DATABASE_URL but force DB name to 'selorabeauty' (single-O).
    """
    raw = os.environ.get("DATABASE_URL", "")

    if raw:
        # Strip query params
        raw = raw.split("?")[0]
        # Fix scheme for asyncpg
        raw = raw.replace("postgres://", "postgresql+asyncpg://").replace(
            "postgresql://", "postgresql+asyncpg://"
        )
        # Force correct DB name — replace anything after last / with selorabeauty
        # This handles seloorabeauty, sellurabeauty, or any other variant
        raw = re.sub(r"/[^/]+$", "/selorabeauty", raw)
        return raw

    # Hardcoded fallback — used when no DATABASE_URL is set
    return "postgresql+asyncpg://selorabeauty:selorabeauty@database:5432/selorabeauty"


DB_URL = _get_db_url()
print(f"[DB] Connecting to: {DB_URL}")

engine = create_async_engine(DB_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
