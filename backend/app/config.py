import os
from pydantic_settings import BaseSettings


def _build_db_url() -> str:
    """
    Build the database URL from individual parts if available,
    or fall back to DATABASE_URL env var, or the hardcoded default.
    This ensures the correct database name is always used.
    """
    # Individual overrides take priority (set these in EasyPanel if needed)
    db_host = os.environ.get("DB_HOST", "database")
    db_port = os.environ.get("DB_PORT", "5432")
    db_name = os.environ.get("DB_NAME", "selorabeauty")
    db_user = os.environ.get("DB_USER", "selorabeauty")
    db_pass = os.environ.get("DB_PASS", "selorabeauty")

    # If any individual part is explicitly set, build URL from parts
    if any(k in os.environ for k in ["DB_HOST", "DB_NAME", "DB_USER", "DB_PASS"]):
        return f"postgres://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}?sslmode=disable"

    # Use DATABASE_URL if set, but fix common naming mistake (seloorabeauty -> selorabeauty)
    raw_url = os.environ.get("DATABASE_URL", "")
    if raw_url:
        # Fix the double-O typo that appeared in EasyPanel config
        fixed = raw_url.replace("seloorabeauty?", "selorabeauty?") \
                       .replace("/seloorabeauty?", "/selorabeauty?") \
                       .replace("/seloorabeauty", "/selorabeauty")
        if fixed != raw_url:
            print(f"⚠️  DATABASE_URL auto-corrected: seloorabeauty → selorabeauty")
        return fixed

    # Hardcoded default
    return f"postgres://{db_user}:{db_pass}@{db_host}:{db_port}/{db_name}?sslmode=disable"


class Settings(BaseSettings):
    DATABASE_URL: str = _build_db_url()
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""
    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    GOOGLE_SHEETS_WEBHOOK_URL: str = ""
    CORS_ORIGINS: str = "https://seloorabeauty.shop,https://www.seloorabeauty.shop,http://localhost:3000,http://localhost:3001,http://localhost:3002"
    COD_FEE: float = 0.0
    VAT_RATE: float = 0.0
    SINGLE_PRICE: float = 199.0
    COMPLETE_SET_PRICE: float = 279.0
    DOUBLE_SET_PRICE: float = 389.0
    UPSELL_PRICE: float = 99.0
    SECRET_KEY: str = "changeme"
    MAXMIND_ACCOUNT_ID: str = ""
    MAXMIND_LICENSE_KEY: str = ""

    class Config:
        env_file = ".env"


settings = Settings()
# Always enforce correct DB name regardless of what was loaded
if "seloorabeauty" in settings.DATABASE_URL.split("@")[-1]:
    settings.DATABASE_URL = settings.DATABASE_URL.replace(
        "/seloorabeauty", "/selorabeauty"
    ).replace("seloorabeauty?", "selorabeauty?")
    print(f"⚠️  DATABASE_URL corrected at runtime: {settings.DATABASE_URL}")
