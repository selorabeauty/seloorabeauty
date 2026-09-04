# 05 — Backend Specification (FastAPI + PostgreSQL)

## Tech Stack

| Layer | Tech | Version |
|---|---|---|
| Framework | FastAPI | 0.111.x |
| Runtime | Python | 3.12 |
| ASGI Server | Uvicorn | 0.30.x |
| ORM | SQLAlchemy (async) | 2.x |
| Migrations | Alembic | 1.13.x |
| Validation | Pydantic v2 | 2.x |
| HTTP Client | httpx (async) | 0.27.x |
| Settings | pydantic-settings | 2.x |
| Database | PostgreSQL | 15 |

---

## File Structure

```
backend/
├── app/
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── order.py
│   │   └── pixel_event.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── order.py
│   │   └── pixel.py
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── orders.py
│   │   └── pixels.py
│   └── services/
│       ├── __init__.py
│       ├── order_service.py
│       ├── tiktok_capi.py
│       ├── snapchat_capi.py
│       └── sheets_webhook.py
├── alembic/
│   ├── env.py
│   └── versions/
│       └── 001_initial_schema.py
├── alembic.ini
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

---

## `requirements.txt`

```
fastapi==0.111.0
uvicorn[standard]==0.30.1
sqlalchemy[asyncio]==2.0.31
asyncpg==0.29.0
alembic==1.13.2
httpx==0.27.0
pydantic==2.7.4
pydantic-settings==2.3.4
python-dotenv==1.0.1
```

---

## `app/config.py`

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    TIKTOK_ACCESS_TOKEN: str = ""
    TIKTOK_PIXEL_ID: str = ""
    SNAPCHAT_ACCESS_TOKEN: str = ""
    SNAPCHAT_PIXEL_ID: str = ""
    GOOGLE_SHEETS_WEBHOOK_URL: str = ""
    CORS_ORIGINS: str = "https://seloorabeauty.shop"
    COD_FEE: float = 20.0
    VAT_RATE: float = 0.15
    HERO_PRICE: float = 99.0
    UPSELL_PRICE: float = 79.0
    SECRET_KEY: str = "changeme"

    class Config:
        env_file = ".env"

settings = Settings()
```

---

## `app/main.py`

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import orders, pixels

app = FastAPI(title="Seloora Beauty API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(orders.router, prefix="/api")
app.include_router(pixels.router, prefix="/api")

@app.get("/health")
async def health():
    return {"status": "ok"}
```

---

## `app/models/order.py`

```python
import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Boolean, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.database import Base

class Order(Base):
    __tablename__ = "orders"

    id             = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id       = Column(String(50), unique=True, nullable=False)
    name           = Column(String(200), nullable=False)
    phone          = Column(String(20), nullable=False)
    product_id     = Column(String(100), nullable=False, default="retinal-serum-150ml")
    product_name   = Column(String(200), nullable=False, default="سيروم الريتينال المُجدِّد ١٥٠مل")
    quantity       = Column(Integer, nullable=False, default=1)
    unit_price     = Column(Numeric(10, 2), nullable=False)
    subtotal       = Column(Numeric(10, 2), nullable=False)
    vat            = Column(Numeric(10, 2), nullable=False)
    cod_fee        = Column(Numeric(10, 2), nullable=False, default=20)
    total          = Column(Numeric(10, 2), nullable=False)
    status         = Column(String(50), nullable=False, default="pending")
    upsell_accepted = Column(Boolean, default=False)
    upsell_qty     = Column(Integer, default=0)
    upsell_total   = Column(Numeric(10, 2), default=0)
    # Pixel data
    ttclid         = Column(String(500))
    sc_cid         = Column(String(500))
    event_id       = Column(String(200))
    ip_address     = Column(String(45))
    user_agent     = Column(Text)
    page_url       = Column(Text)
    # Timestamps
    created_at     = Column(DateTime, default=datetime.utcnow)
    updated_at     = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
```

---

## `app/schemas/order.py`

```python
import re
from pydantic import BaseModel, validator

KSA_PHONE_RE = re.compile(r'^05[0-9]{8}$')

class OrderCreate(BaseModel):
    name: str
    phone: str
    quantity: int = 1
    ttclid: str | None = None
    sc_cid: str | None = None
    event_id: str | None = None
    ip: str | None = None
    user_agent: str | None = None
    page_url: str | None = None

    @validator('phone')
    def validate_ksa_phone(cls, v):
        clean = v.replace(' ', '').replace('-', '')
        if not KSA_PHONE_RE.match(clean):
            raise ValueError('رقم الجوال غير صحيح — يجب أن يبدأ بـ 05 ويكون 10 أرقام')
        return clean

    @validator('name')
    def validate_name(cls, v):
        if len(v.strip()) < 2:
            raise ValueError('الاسم مطلوب')
        return v.strip()

class OrderResponse(BaseModel):
    order_id: str
    total: float
    status: str

class UpsellRequest(BaseModel):
    order_id: str
    accepted: bool
    quantity: int = 1

class UpsellResponse(BaseModel):
    order_id: str
    upsell_total: float
    new_total: float
```

---

## `app/services/order_service.py`

```python
import random, string
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order import Order
from app.config import settings
from app.services.tiktok_capi import fire_tiktok_purchase
from app.services.snapchat_capi import fire_snapchat_purchase
from app.services.sheets_webhook import send_to_sheets

def generate_order_id() -> str:
    suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SLR-{suffix}"

async def create_order(db: AsyncSession, data: dict) -> Order:
    price    = settings.HERO_PRICE
    qty      = data.get("quantity", 1)
    subtotal = price * qty
    vat      = round(subtotal * settings.VAT_RATE, 2)
    cod_fee  = settings.COD_FEE
    total    = subtotal + vat + cod_fee

    order = Order(
        order_id     = generate_order_id(),
        name         = data["name"],
        phone        = data["phone"],
        quantity     = qty,
        unit_price   = price,
        subtotal     = subtotal,
        vat          = vat,
        cod_fee      = cod_fee,
        total        = total,
        ttclid       = data.get("ttclid"),
        sc_cid       = data.get("sc_cid"),
        event_id     = data.get("event_id"),
        ip_address   = data.get("ip"),
        user_agent   = data.get("user_agent"),
        page_url     = data.get("page_url"),
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Fire pixels + sheets (non-blocking)
    import asyncio
    asyncio.create_task(fire_tiktok_purchase(order))
    asyncio.create_task(fire_snapchat_purchase(order))
    asyncio.create_task(send_to_sheets(order))

    return order

async def accept_upsell(db: AsyncSession, order_id: str, qty: int = 1) -> Order:
    result = await db.execute(select(Order).where(Order.order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise ValueError("Order not found")

    upsell_total = settings.UPSELL_PRICE * qty
    order.upsell_accepted = True
    order.upsell_qty      = qty
    order.upsell_total    = upsell_total
    order.total           = float(order.total) + upsell_total
    order.updated_at      = datetime.utcnow()

    await db.commit()
    await db.refresh(order)
    return order
```

---

## `app/services/tiktok_capi.py`

```python
import hashlib, httpx, time
from app.config import settings
from app.models.order import Order

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"

def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()

async def fire_tiktok_purchase(order: Order):
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return

    phone_e164 = "+966" + order.phone[1:]  # 05XXXXXXXX → +9665XXXXXXXX

    payload = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_ID,
        "data": [{
            "event": "CompletePayment",
            "event_time": int(time.time()),
            "event_id": order.event_id or str(order.id),
            "user": {
                "ttclid": order.ttclid or "",
                "phone": sha256(phone_e164),
                "ip": order.ip_address or "",
                "user_agent": order.user_agent or "",
            },
            "page": {"url": order.page_url or "https://seloorabeauty.shop/ar"},
            "properties": {
                "currency": "SAR",
                "value": float(order.total),
                "content_type": "product",
                "contents": [{
                    "content_id": "retinal-serum-150ml",
                    "content_name": "سيروم الريتينال المُجدِّد ١٥٠مل",
                    "quantity": order.quantity,
                    "price": float(order.unit_price),
                }],
                "order_id": order.order_id,
            },
        }],
    }

    async with httpx.AsyncClient() as client:
        await client.post(
            TIKTOK_CAPI_URL,
            json=payload,
            headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            timeout=10,
        )
```

---

## `app/services/snapchat_capi.py`

```python
import hashlib, httpx, time
from app.config import settings
from app.models.order import Order

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"

def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()

async def fire_snapchat_purchase(order: Order):
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return

    phone_normalized = "+966" + order.phone[1:]

    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "data": [{
            "event_name": "PURCHASE",
            "event_time": int(time.time()),
            "event_id": order.event_id or str(order.id),
            "action_source": "WEB",
            "event_source_url": order.page_url or "https://seloorabeauty.shop/ar",
            "user_data": {
                "ph": [sha256(phone_normalized)],
                "client_ip_address": order.ip_address or "",
                "client_user_agent": order.user_agent or "",
                "sc_click_id": order.sc_cid or "",
            },
            "custom_data": {
                "currency": "SAR",
                "value": str(float(order.total)),
                "order_id": order.order_id,
                "contents": [{
                    "id": "retinal-serum-150ml",
                    "quantity": str(order.quantity),
                    "item_price": str(float(order.unit_price)),
                }],
            },
        }],
    }

    async with httpx.AsyncClient() as client:
        await client.post(
            SNAP_CAPI_URL,
            json=payload,
            headers={"Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}"},
            timeout=10,
        )
```

---

## `app/services/sheets_webhook.py`

```python
import httpx
from datetime import datetime
from app.config import settings
from app.models.order import Order

async def send_to_sheets(order: Order):
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        return

    payload = {
        "order_id":       order.order_id,
        "name":           order.name,
        "phone":          order.phone,
        "product":        order.product_name,
        "quantity":       order.quantity,
        "unit_price":     float(order.unit_price),
        "subtotal":       float(order.subtotal),
        "vat":            float(order.vat),
        "cod_fee":        float(order.cod_fee),
        "total":          float(order.total),
        "upsell":         "نعم" if order.upsell_accepted else "لا",
        "upsell_qty":     order.upsell_qty,
        "upsell_total":   float(order.upsell_total or 0),
        "status":         "جديد",
        "created_at":     datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "source_url":     order.page_url or "",
        "ttclid":         order.ttclid or "",
        "sc_cid":         order.sc_cid or "",
    }

    async with httpx.AsyncClient() as client:
        await client.post(
            settings.GOOGLE_SHEETS_WEBHOOK_URL,
            json=payload,
            timeout=10,
        )
```

---

## Alembic Migration: `001_initial_schema.py`

```python
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID, JSONB

def upgrade():
    op.create_table(
        'orders',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('order_id', sa.String(50), unique=True, nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('product_id', sa.String(100), nullable=False, server_default='retinal-serum-150ml'),
        sa.Column('product_name', sa.String(200), nullable=False),
        sa.Column('quantity', sa.Integer, nullable=False, server_default='1'),
        sa.Column('unit_price', sa.Numeric(10,2), nullable=False),
        sa.Column('subtotal', sa.Numeric(10,2), nullable=False),
        sa.Column('vat', sa.Numeric(10,2), nullable=False),
        sa.Column('cod_fee', sa.Numeric(10,2), nullable=False, server_default='20'),
        sa.Column('total', sa.Numeric(10,2), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('upsell_accepted', sa.Boolean, server_default='false'),
        sa.Column('upsell_qty', sa.Integer, server_default='0'),
        sa.Column('upsell_total', sa.Numeric(10,2), server_default='0'),
        sa.Column('ttclid', sa.String(500)),
        sa.Column('sc_cid', sa.String(500)),
        sa.Column('event_id', sa.String(200)),
        sa.Column('ip_address', sa.String(45)),
        sa.Column('user_agent', sa.Text),
        sa.Column('page_url', sa.Text),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

    op.create_table(
        'pixel_events',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('order_id', sa.String(50)),
        sa.Column('event_name', sa.String(100), nullable=False),
        sa.Column('platform', sa.String(50), nullable=False),
        sa.Column('event_id', sa.String(200), nullable=False),
        sa.Column('payload', JSONB),
        sa.Column('response', JSONB),
        sa.Column('status_code', sa.Integer),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
    )

def downgrade():
    op.drop_table('pixel_events')
    op.drop_table('orders')
```

---

## Dockerfile (backend)

```dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run migrations then start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
```

## docker-compose.yml (backend)

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    restart: unless-stopped
```

## .env.example (backend)

```env
DATABASE_URL=postgres://selorabeauty:selorabeauty@selorabeauty_database:5432/seloorabeauty?sslmode=disable
TIKTOK_ACCESS_TOKEN=
TIKTOK_PIXEL_ID=
SNAPCHAT_ACCESS_TOKEN=
SNAPCHAT_PIXEL_ID=
GOOGLE_SHEETS_WEBHOOK_URL=
CORS_ORIGINS=https://seloorabeauty.shop
COD_FEE=20
VAT_RATE=0.15
HERO_PRICE=99
UPSELL_PRICE=79
SECRET_KEY=change-this-to-random-string
```
