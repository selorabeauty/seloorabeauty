# 01 — Project Overview: Seloora Beauty

## Brand Summary

| Field | Value |
|---|---|
| Brand Name | **Seloora Beauty** (سيلورا بيوتي) |
| Domain | `seloorabeauty.shop` |
| Market | Kingdom of Saudi Arabia (KSA) |
| Channel | DTC — Social commerce (TikTok, Snapchat) → Landing store |
| Business Model | COD (Cash on Delivery), single SKU hero + upsell |
| Target Launch | ASAP — mobile-first, conversion-optimized |
| Backend URL | `api.seloorabeauty.shop` |
| Database | `postgres://selorabeauty:selorabeauty@selorabeauty_database:5432/seloorabeauty?sslmode=disable` |

---

## Hero Product

| Field | Value |
|---|---|
| Product Name (EN) | Retinal Skin Booster Serum |
| Product Name (AR) | سيروم الريتينال المُجدِّد للبشرة |
| Size | 150 ml |
| Price | **99 SAR** (hero/launch price — only place discount is applied) |
| Original Price | 149 SAR (crossed out) |
| Key Ingredients | Encapsulated Retinal · Centella Asiatica · Niacinamide |
| Source | Alibaba (private label / white label — Corian brand not available in KSA) |
| Primary Angles | ① علامات التمدد (Stretch marks) ② تشققات الجسم (Body cracks) ③ التجاعيد (Wrinkles) |
| Unique Angle | Clinical-grade **encapsulated** retinal — rebuilds collagen deep in skin layers. Fades stretch marks, heals cracks, erases fine lines. Soothed with Centella. Brightened with Niacinamide. Zero irritation. Available **exclusively** in KSA through Seloora. |

---

## Business Goals

1. **Primary:** Maximize confirmed COD orders from TikTok & Snapchat traffic
2. **Secondary:** Increase AOV via a single 10-second timed upsell after checkout popup submission
3. **Tertiary:** Build brand trust & authority so customers repeat-order and refer

---

## Tech Stack Decision

```
Frontend:   Next.js 14 (App Router) + TypeScript + Tailwind CSS
Backend:    Python FastAPI + SQLAlchemy + Alembic (migrations)
Database:   PostgreSQL (EasyPanel managed)
Hosting:    EasyPanel (VPS) — frontend + backend separate services
Pixels:     TikTok Pixel + TikTok CAPI | Snapchat Pixel + Snap CAPI
Orders:     PostgreSQL → Google Sheets (webhook) → CSV export
Containers: Docker (frontend + backend each have Dockerfile + docker-compose)
```

---

## Folder Deliverables

```
/frontend        → Next.js app (deploy to EasyPanel)
/backend         → FastAPI app (deploy to EasyPanel)
/docs            → All specification & guide MDs (this folder)
```

---

## Key Constraints

- **Arabic RTL** — site is 100% Arabic, direction: rtl
- **KSA phone validation** — only valid Saudi mobile numbers (05XXXXXXXX, 10 digits)
- **COD only** — no payment gateway needed
- **Images** — placeholders now, client will provide real product images
- **No email required** — checkout: name + phone only
- **Pixel deduplication** — event_id must match browser pixel + CAPI on every event
- **Speed** — pixels deferred (load after LCP), Core Web Vitals priority
- **Google Sheets** — all orders forwarded via Make/Zapier webhook or direct API

---

## Revenue Model

| Item | Value |
|---|---|
| Hero price | 99 SAR |
| COD fee | +20 SAR |
| VAT 15% | included in price |
| Upsell offer | Same product 2nd unit for 79 SAR (shown 10s after order submit) |
| Target AOV | 178 SAR (hero + upsell) |
| Fulfillment | Via KSA 3PL / branded store warehouse |
