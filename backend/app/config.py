from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgres://selorabeauty:selorabeauty@selorabeauty_database:5432/seloorabeauty?sslmode=disable"
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""
    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    GOOGLE_SHEETS_WEBHOOK_URL: str = ""
    CORS_ORIGINS: str = "https://seloorabeauty.shop,http://localhost:3000,http://localhost:3001,http://localhost:3002"
    COD_FEE: float = 20.0
    VAT_RATE: float = 0.15
    HERO_PRICE: float = 99.0
    UPSELL_PRICE: float = 79.0
    SECRET_KEY: str = "changeme"

    class Config:
        env_file = ".env"


settings = Settings()
