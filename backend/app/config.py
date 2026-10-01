import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgres://selorabeauty:selorabeauty@database:5432/seloorabeauty?sslmode=disable"
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""
    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    # Google Sheets direct API
    GOOGLE_SPREADSHEET_ID: str = ""
    GOOGLE_SA_CLIENT_EMAIL: str = ""
    GOOGLE_SA_PRIVATE_KEY: str = ""
    GOOGLE_SA_PRIVATE_KEY_ID: str = ""
    GOOGLE_SA_CLIENT_ID: str = ""

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
