import os
import re
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase


def _get_db_url() -> str:
    raw = os.environ.get("DATABASE_URL", "postgres://selorabeauty:selorabeauty@database:5432/selorabeauty")
    raw = raw.split("?")[0]
    raw = raw.replace("postgres://", "postgresql+asyncpg://").replace("postgresql://", "postgresql+asyncpg://")
    # Always use selorabeauty as DB name regardless of what DATABASE_URL says
    raw = re.sub(r"/[^/]+$", "/selorabeauty", raw)
    print(f"[DB] Connection URL: {raw}")
    return raw


DB_URL = _get_db_url()
engine = create_async_engine(DB_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
