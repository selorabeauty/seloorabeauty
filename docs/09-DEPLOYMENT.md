# 09 — Deployment Guide (EasyPanel + Docker + GitHub)

## Infrastructure Overview

```
GitHub Repo (monorepo)
├── /frontend    → EasyPanel Service: seloorabeauty.shop
└── /backend     → EasyPanel Service: api.seloorabeauty.shop

Database: PostgreSQL (EasyPanel managed, internal URL)
DNS: seloorabeauty.shop → EasyPanel server IP
     api.seloorabeauty.shop → EasyPanel server IP (same)
```

---

## GitHub Repository Structure

```
seloorabeauty/                    ← root repo
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── package.json
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── .env.example
│   ├── requirements.txt
│   └── alembic.ini
├── docs/                         ← this folder
└── README.md
```

---

## Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .

# Build args become env vars at build time
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_TIKTOK_PIXEL_ID
ARG NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
ARG NEXT_PUBLIC_SITE_URL

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_TIKTOK_PIXEL_ID=$NEXT_PUBLIC_TIKTOK_PIXEL_ID
ENV NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=$NEXT_PUBLIC_SNAPCHAT_PIXEL_ID
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

RUN npm run build

# Production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

**Important:** Add to `next.config.js`:
```js
const nextConfig = {
  output: 'standalone',   // ← required for Docker
  images: { domains: ['images.unsplash.com'] },
};
module.exports = nextConfig;
```

## Frontend docker-compose.yml

```yaml
version: '3.8'
services:
  frontend:
    build:
      context: .
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
        NEXT_PUBLIC_TIKTOK_PIXEL_ID: ${NEXT_PUBLIC_TIKTOK_PIXEL_ID}
        NEXT_PUBLIC_SNAPCHAT_PIXEL_ID: ${NEXT_PUBLIC_SNAPCHAT_PIXEL_ID}
        NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
    ports:
      - "3000:3000"
    env_file: .env
    restart: unless-stopped
```

## Frontend `.env.example`

```env
NEXT_PUBLIC_API_URL=https://api.seloorabeauty.shop
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAPCHAT_PIXEL_ID=
NEXT_PUBLIC_SITE_URL=https://seloorabeauty.shop
```

---

## Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Run Alembic migrations then start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2"]
```

## Backend docker-compose.yml

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    env_file: .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

## Backend `.env.example`

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
SECRET_KEY=
```

---

## EasyPanel Setup Steps

### Step 1: Create PostgreSQL Database
- EasyPanel → New Service → PostgreSQL
- Name: `selorabeauty_database`
- DB name: `seloorabeauty`
- User: `selorabeauty`
- Pass: `selorabeauty`
- Internal URL: `postgres://selorabeauty:selorabeauty@selorabeauty_database:5432/seloorabeauty?sslmode=disable`

### Step 2: Deploy Backend
1. EasyPanel → New App → GitHub → select `seloorabeauty` repo
2. Build: `Dockerfile`, Root: `/backend`
3. Port: `8000`
4. Domain: `api.seloorabeauty.shop` → Enable SSL
5. Add environment variables (from `.env.example`)
6. Deploy → watch logs for "Application startup complete"

### Step 3: Deploy Frontend
1. EasyPanel → New App → GitHub → same repo
2. Build: `Dockerfile`, Root: `/frontend`
3. Port: `3000`
4. Domain: `seloorabeauty.shop` + `www.seloorabeauty.shop` → Enable SSL
5. Add environment variables
6. **Important:** `NEXT_PUBLIC_API_URL=https://api.seloorabeauty.shop`
7. Deploy

### Step 4: DNS Configuration (at domain registrar)
```
Type    Name    Value                       TTL
A       @       [EasyPanel server IP]       300
A       www     [EasyPanel server IP]       300
A       api     [EasyPanel server IP]       300
```

---

## GitHub Actions CI/CD (optional but recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy to EasyPanel

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger EasyPanel deploy (backend)
        run: |
          curl -X POST "${{ secrets.EASYPANEL_BACKEND_WEBHOOK }}"

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Trigger EasyPanel deploy (frontend)
        run: |
          curl -X POST "${{ secrets.EASYPANEL_FRONTEND_WEBHOOK }}"
```

Add EasyPanel webhook URLs in GitHub → Settings → Secrets.

---

## Database Migration on Backend Start

The `CMD` in Dockerfile runs `alembic upgrade head` before starting the server.  
This means **every deployment automatically applies new migrations**.

To run manually:
```bash
# Inside backend container
docker exec -it <container_id> alembic upgrade head

# Or via EasyPanel terminal
alembic upgrade head
```

To create new migration after model changes:
```bash
alembic revision --autogenerate -m "add_new_column"
```

---

## Post-Deploy Checklist

- [ ] `https://seloorabeauty.shop` loads homepage in Arabic (RTL)
- [ ] `https://api.seloorabeauty.shop/health` returns `{"status": "ok"}`
- [ ] `https://api.seloorabeauty.shop/docs` shows FastAPI Swagger UI
- [ ] Submit test order → check PostgreSQL orders table
- [ ] Submit test order → check Google Sheets webhook row appears
- [ ] Submit test order → verify TikTok Events Manager test events
- [ ] Submit test order → verify Snapchat Events Manager
- [ ] SSL certificates valid for both domains
- [ ] Mobile responsiveness verified on iPhone + Android
- [ ] Checkout popup opens and validates KSA phone correctly
- [ ] Upsell popup appears 10s after order success
- [ ] Sticky buy bar appears after scrolling 700px

---

## Monitoring & Logs

- **EasyPanel** → App → Logs → view real-time container logs
- **PostgreSQL** → check order count: `SELECT COUNT(*) FROM orders;`
- **TikTok Events Manager** → Test Events tab → trigger real events
- **Snapchat Events Manager** → Real-time events validation
