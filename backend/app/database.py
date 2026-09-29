import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase

# Use DATABASE_URL from environment directly, just fix the scheme for asyncpg
_raw = os.environ.get(
    "DATABASE_URL",
    "postgres://selorabeauty:selorabeauty@database:5432/seloorabeauty"
).split("?")[0]

DB_URL = _raw.replace("postgres://", "postgresql+asyncpg://").replace(
    "postgresql://", "postgresql+asyncpg://"
)

print(f"[DB] Using connection: {DB_URL}")

engine = create_async_engine(DB_URL, echo=False, pool_pre_ping=True)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
