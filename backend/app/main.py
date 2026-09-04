from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import orders

app = FastAPI(
    title="Seloora Beauty API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "seloora-beauty-api"}


@app.get("/")
async def root():
    return {"message": "Seloora Beauty API", "docs": "/docs"}
