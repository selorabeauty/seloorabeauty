# 10 — Delivery Files: Google Sheets + CSV + Webhook

## Google Sheets Template

### Sheet Name: `سيلورا — الطلبات`

### Columns (in order — Column A to S):

| Column | Header (AR) | Header (EN) | Example Value |
|---|---|---|---|
| A | رقم الطلب | order_id | SLR-ABC123 |
| B | الاسم | name | سارة الأحمد |
| C | الجوال | phone | 0501234567 |
| D | المنتج | product | سيروم الريتينال ١٥٠مل |
| E | الكمية | quantity | 1 |
| F | سعر الوحدة | unit_price | 99.00 |
| G | المجموع الفرعي | subtotal | 99.00 |
| H | ضريبة القيمة المضافة | vat | 14.85 |
| I | رسوم الدفع عند الاستلام | cod_fee | 20.00 |
| J | الإجمالي | total | 133.85 |
| K | أبسل (نعم/لا) | upsell | لا |
| L | كمية الأبسل | upsell_qty | 0 |
| M | إجمالي الأبسل | upsell_total | 0.00 |
| N | الحالة | status | جديد |
| O | تاريخ الطلب | created_at | 2026-08-25 18:30:00 |
| P | المدينة | city | (من العنوان إن توفر) |
| Q | رابط الصفحة | source_url | https://seloorabeauty.shop/ar |
| R | TikTok Click ID | ttclid | E.C.P.xxxx |
| S | Snapchat Click ID | sc_cid | xxxx |

---

## CSV Template File

**Filename:** `orders_template.csv`

```csv
رقم الطلب,الاسم,الجوال,المنتج,الكمية,سعر الوحدة,المجموع الفرعي,ضريبة القيمة المضافة,رسوم الدفع عند الاستلام,الإجمالي,أبسل,كمية الأبسل,إجمالي الأبسل,الحالة,تاريخ الطلب,المدينة,رابط الصفحة,TikTok Click ID,Snapchat Click ID
SLR-EXAMPLE,سارة الأحمد,0501234567,سيروم الريتينال ١٥٠مل,1,99.00,99.00,14.85,20.00,133.85,لا,0,0.00,جديد,2026-08-25 18:30:00,,https://seloorabeauty.shop/ar,,
```

---

## Google Sheets Webhook Setup (via Make.com / Zapier)

### Option A: Make.com (Recommended — easier Arabic support)

1. **Create Make.com account** → New Scenario
2. **Trigger:** Webhooks → Custom Webhook → Copy URL → paste into backend `GOOGLE_SHEETS_WEBHOOK_URL`
3. **Action:** Google Sheets → Add a Row
4. **Map fields:**
```
A ← order_id
B ← name
C ← phone
D ← product
E ← quantity
F ← unit_price
G ← subtotal
H ← vat
I ← cod_fee
J ← total
K ← upsell
L ← upsell_qty
M ← upsell_total
N ← status  (hardcode: "جديد")
O ← created_at
P ← (leave empty — no city in form)
Q ← source_url
R ← ttclid
S ← sc_cid
```

### Option B: Zapier

1. **Trigger:** Webhooks by Zapier → Catch Hook → copy URL
2. **Action:** Google Sheets → Create Spreadsheet Row
3. Same field mapping as above

### Option C: Direct Google Sheets API (no Make/Zapier — advanced)

```python
# backend/app/services/sheets_webhook.py (alternative to webhook)
# Use google-auth + gspread libraries
# Requires Service Account JSON key in backend env vars
# More complex but no third-party dependency

import gspread
from google.oauth2.service_account import Credentials

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

async def send_to_sheets_direct(order):
    creds = Credentials.from_service_account_file('service_account.json', scopes=SCOPES)
    client = gspread.authorize(creds)
    sheet = client.open_by_key(SHEET_ID).sheet1
    sheet.append_row([
        order.order_id, order.name, order.phone, order.product_name,
        order.quantity, float(order.unit_price), float(order.subtotal),
        float(order.vat), float(order.cod_fee), float(order.total),
        "نعم" if order.upsell_accepted else "لا", order.upsell_qty,
        float(order.upsell_total or 0), "جديد",
        order.created_at.strftime("%Y-%m-%d %H:%M:%S"),
        "", order.page_url or "", order.ttclid or "", order.sc_cid or "",
    ])
```

---

## Order Status Workflow (Sheet Management)

Update column N (الحالة) manually or via your fulfillment team:

| Status Value | Meaning |
|---|---|
| جديد | New order — just received |
| تم التأكيد | Confirmed by phone/team |
| تم الشحن | Shipped to courier |
| تم التسليم | Delivered successfully |
| مرتجع | Returned |
| ملغي | Cancelled |

---

## WhatsApp Notification (Optional)

To auto-send order details to a WhatsApp business number (for small teams):

```python
# Using CallMeBot or WA Business API
# backend/app/services/whatsapp_notify.py

import httpx

async def notify_whatsapp(order):
    phone = "YOUR_BUSINESS_WHATSAPP"
    apikey = "YOUR_CALLMEBOT_KEY"
    message = (
        f"🛍️ طلب جديد!\n"
        f"رقم: {order.order_id}\n"
        f"الاسم: {order.name}\n"
        f"الجوال: {order.phone}\n"
        f"المنتج: {order.product_name} x{order.quantity}\n"
        f"الإجمالي: {float(order.total):.2f} ريال\n"
        f"أبسل: {'نعم' if order.upsell_accepted else 'لا'}"
    )
    url = f"https://api.callmebot.com/whatsapp.php?phone={phone}&text={message}&apikey={apikey}"
    async with httpx.AsyncClient() as client:
        await client.get(url, timeout=5)
```

---

## Fulfillment Sheet Columns (Delivery Team View)

Create a second sheet tab **"للتوصيل"** with only these columns (hide tech columns):

| Column | Header | Notes |
|---|---|---|
| A | رقم الطلب | for reference |
| B | الاسم | customer name |
| C | الجوال | for courier |
| D | الكمية | pieces to ship |
| E | الإجمالي للتحصيل | total to collect (COD) |
| F | الحالة | update this column |
| G | تاريخ الطلب | |
| H | ملاحظات | manual notes |

Use Google Sheets IMPORTRANGE or QUERY formula to auto-populate from main sheet:
```
=QUERY(Orders!A:S, "SELECT A, B, C, E, J, N, O WHERE N='جديد'", 1)
```

---

## CSV Export for Fulfillment Partners

Export from Google Sheets:
- File → Download → CSV (.csv)
- Or automate with Make.com: every day at 8am → export new orders → email CSV

**CSV columns for 3PL/courier:**
```csv
order_id,customer_name,phone,qty,cod_amount,status
SLR-ABC123,سارة الأحمد,0501234567,1,133.85,جديد
```
