# 03 — Full System Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER (Mobile / Desktop)                  │
│                    TikTok / Snapchat Ad Traffic                 │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               FRONTEND — seloorabeauty.shop                     │
│         Next.js 14 (App Router) + TypeScript + Tailwind         │
│         Docker container → EasyPanel → Nginx reverse proxy      │
│                                                                 │
│  Pages:                                                         │
│  /            → Home (hero, product, reviews, FAQ, trust)       │
│  /product     → Product detail page                             │
│  /order/success → Thank you page                                │
│                                                                 │
│  Pixels (deferred, after LCP):                                  │
│  - TikTok Pixel (browser) + ttclid capture                      │
│  - Snapchat Pixel (browser) + ScCid capture                     │
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS API calls
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│               BACKEND — api.seloorabeauty.shop                  │
│                  Python FastAPI + Uvicorn                       │
│               Docker container → EasyPanel                      │
│                                                                 │
│  Endpoints:                                                     │
│  POST /api/orders          → Create order (checkout submit)     │
│  POST /api/orders/upsell   → Accept/decline upsell             │
│  GET  /api/orders/{id}     → Order status                       │
│  POST /api/pixel/tiktok    → TikTok CAPI relay                  │
│  POST /api/pixel/snapchat  → Snapchat CAPI relay                │
│  GET  /health              → Health check                       │
│                                                                 │
│  On order create:                                               │
│  1. Save to PostgreSQL                                          │
│  2. Fire TikTok CAPI CompletePayment                            │
│  3. Fire Snapchat CAPI PURCHASE                                 │
│  4. POST to Google Sheets webhook                               │
└──────────┬──────────────────────────────────────────────────────┘
           │
    ┌──────┴────────┐
    │               │
    ▼               ▼
┌────────┐    ┌─────────────────────────┐
│  PG DB │    │   Google Sheets         │
│ Orders │    │   (via webhook/Make.io) │
│ Events │    │   Orders spreadsheet    │
└────────┘    └─────────────────────────┘
```

---

## Frontend Tech Stack

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | Next.js (App Router) | 14.x | SSR/SSG for SEO, fast routing, image optimization |
| Language | TypeScript | 5.x | Type safety, fewer bugs |
| Styling | Tailwind CSS | 3.x | Utility-first, fast UI, consistent design |
| State | Zustand | 4.x | Lightweight cart & UI state |
| Animations | Framer Motion | 11.x | Smooth page transitions, CTA pulse |
| Icons | Lucide React | latest | Clean SVG icons |
| i18n | next-intl | 3.x | Arabic RTL, translation files |
| Forms | Native React | — | Simple 2-field checkout, no heavy lib needed |
| HTTP Client | fetch (native) | — | No axios needed for simple calls |
| Pixel | Custom hooks | — | Deferred load, event_id dedup |

### Frontend Folder Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── page.tsx              ← Home page
│   │   │   ├── product/page.tsx      ← Product detail
│   │   │   └── order/success/page.tsx← Thank you page
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            ← Logo + menu + cart icon
│   │   │   └── Footer.tsx            ← Links, trust, social
│   │   ├── sections/
│   │   │   ├── Hero.tsx              ← Above fold: hook + CTA
│   │   │   ├── TrustBar.tsx          ← COD / shipping / guarantee
│   │   │   ├── ProductSection.tsx    ← Product info + add to cart
│   │   │   ├── IngredientsSection.tsx← Science + ingredient cards
│   │   │   ├── HowItWorksSection.tsx ← 3-step visual
│   │   │   ├── ResultsSection.tsx    ← Before/after + % stats
│   │   │   ├── ReviewsSection.tsx    ← Real reviews + rating
│   │   │   ├── UrgencySection.tsx    ← Stock scarcity + timer
│   │   │   └── FaqSection.tsx        ← Objection-handling FAQ
│   │   └── ui/
│   │       ├── CheckoutPopup.tsx     ← Main modal: name+phone+order summary
│   │       ├── UpsellPopup.tsx       ← 10-second timed upsell after submit
│   │       ├── StickyBuyBar.tsx      ← Fixed bottom CTA (after scroll)
│   │       └── ProductCard.tsx       ← Reusable product card
│   ├── hooks/
│   │   ├── usePixel.ts               ← TikTok + Snap pixel events
│   │   └── useCart.ts                ← Cart state logic
│   ├── lib/
│   │   ├── api.ts                    ← Backend API calls
│   │   ├── pixels.ts                 ← Pixel fire helpers (deferred)
│   │   └── utils.ts                  ← Formatters, validators
│   ├── store/
│   │   └── cartStore.ts              ← Zustand cart store
│   └── messages/
│       └── ar.json                   ← All Arabic copy
├── public/
│   └── images/                       ← Product images (placeholder → real)
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── package.json
```

---

## Backend Tech Stack

| Layer | Technology | Version | Reason |
|---|---|---|---|
| Framework | FastAPI | 0.111.x | Async, fast, auto OpenAPI docs |
| Language | Python | 3.12 | Stable, wide library support |
| ORM | SQLAlchemy | 2.x | Async ORM, PostgreSQL support |
| Migrations | Alembic | 1.x | DB schema versioning |
| Server | Uvicorn | 0.30.x | ASGI, production-ready |
| HTTP Client | httpx | 0.27.x | Async HTTP for CAPI calls |
| Validation | Pydantic v2 | 2.x | Built into FastAPI |
| Hashing | hashlib (stdlib) | — | SHA256 for CAPI user data |

### Backend Folder Structure
```
backend/
├── app/
│   ├── main.py                    ← FastAPI app init, CORS, startup
│   ├── config.py                  ← Settings from env vars (pydantic-settings)
│   ├── database.py                ← Async SQLAlchemy engine + session
│   ├── models/
│   │   ├── order.py               ← Order, OrderItem SQLAlchemy models
│   │   └── pixel_event.py         ← PixelEvent log model
│   ├── schemas/
│   │   ├── order.py               ← Pydantic request/response schemas
│   │   └── pixel.py               ← Pixel event schemas
│   ├── routers/
│   │   ├── orders.py              ← POST /api/orders, upsell, status
│   │   └── pixels.py              ← POST /api/pixel/tiktok|snapchat
│   ├── services/
│   │   ├── order_service.py       ← Business logic: create, upsell
│   │   ├── tiktok_capi.py         ← TikTok Events API calls
│   │   ├── snapchat_capi.py       ← Snapchat CAPI calls
│   │   └── sheets_webhook.py      ← Google Sheets forwarding
│   └── migrations/
│       ├── env.py
│       └── versions/
│           └── 001_initial.py     ← Initial DB schema
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── requirements.txt
└── alembic.ini
```

---

## Database Schema

### Table: `orders`
```sql
CREATE TABLE orders (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    VARCHAR(50) UNIQUE NOT NULL,  -- e.g. SLR-ABC123
    name        VARCHAR(200) NOT NULL,
    phone       VARCHAR(20) NOT NULL,          -- normalized: 05XXXXXXXX
    city        VARCHAR(100),
    address     TEXT,
    product_id  VARCHAR(100) NOT NULL,
    product_name VARCHAR(200) NOT NULL,
    quantity    INTEGER NOT NULL DEFAULT 1,
    unit_price  NUMERIC(10,2) NOT NULL,        -- 99.00
    subtotal    NUMERIC(10,2) NOT NULL,
    vat         NUMERIC(10,2) NOT NULL,
    cod_fee     NUMERIC(10,2) NOT NULL DEFAULT 20,
    total       NUMERIC(10,2) NOT NULL,
    status      VARCHAR(50) NOT NULL DEFAULT 'pending',
    upsell_accepted BOOLEAN DEFAULT FALSE,
    upsell_qty  INTEGER DEFAULT 0,
    upsell_total NUMERIC(10,2) DEFAULT 0,
    -- Pixel tracking
    ttclid      VARCHAR(500),                  -- TikTok click ID
    sc_cid      VARCHAR(500),                  -- Snapchat click ID
    ip_address  VARCHAR(45),
    user_agent  TEXT,
    page_url    TEXT,
    -- Timestamps
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Table: `pixel_events`
```sql
CREATE TABLE pixel_events (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id    VARCHAR(50),
    event_name  VARCHAR(100) NOT NULL,       -- CompletePayment, PURCHASE, etc
    platform    VARCHAR(50) NOT NULL,        -- tiktok | snapchat
    event_id    VARCHAR(200) NOT NULL,       -- dedup ID
    payload     JSONB,                       -- full payload sent
    response    JSONB,                       -- API response
    status_code INTEGER,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## API Contract

### POST `/api/orders`
**Request:**
```json
{
  "name": "سارة الأحمد",
  "phone": "0501234567",
  "product_id": "retinal-serum-150ml",
  "quantity": 1,
  "ttclid": "E.C.P.xxxx",
  "sc_cid": "xxxx",
  "event_id": "evt_abc123",
  "ip": "1.2.3.4",
  "user_agent": "Mozilla...",
  "page_url": "https://seloorabeauty.shop/ar"
}
```

**Response:**
```json
{
  "order_id": "SLR-ABC123",
  "total": 133.85,
  "status": "confirmed"
}
```

### POST `/api/orders/upsell`
**Request:**
```json
{
  "order_id": "SLR-ABC123",
  "accepted": true,
  "quantity": 1
}
```

**Response:**
```json
{
  "order_id": "SLR-ABC123",
  "upsell_total": 79.00,
  "new_total": 212.85
}
```

---

## Environment Variables

### Frontend `.env.example`
```env
NEXT_PUBLIC_API_URL=https://api.seloorabeauty.shop
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=https://seloorabeauty.shop
```

### Backend `.env.example`
```env
DATABASE_URL=postgres://selorabeauty:selorabeauty@selorabeauty_database:5432/seloorabeauty?sslmode=disable
TIKTOK_ACCESS_TOKEN=your_tiktok_events_api_access_token
TIKTOK_PIXEL_ID=your_tiktok_pixel_id
SNAPCHAT_ACCESS_TOKEN=your_snapchat_access_token
SNAPCHAT_PIXEL_ID=your_snapchat_pixel_id
GOOGLE_SHEETS_WEBHOOK_URL=https://hooks.zapier.com/hooks/catch/XXXXX/YYYYY/
CORS_ORIGINS=https://seloorabeauty.shop
COD_FEE=20
VAT_RATE=0.15
HERO_PRICE=99
UPSELL_PRICE=79
SECRET_KEY=your-random-secret-key-here
```
