import httpx
from datetime import datetime
from app.config import settings


async def send_to_sheets(order) -> None:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        return
    payload = {
        "date":           datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "order_id":       order.order_id,
        "country":        "SA",
        "name":           order.name,
        "phone":          order.phone,
        "city":           order.city,
        "district":       order.district,
        "address":        order.address,
        "payment_method": order.payment_method,
        "product":        order.product_name,
        "sku":            order.product_id,
        "quantity":       order.quantity,
        "total_price":    float(order.total),
        "statut":         "جديد",
    }
    try:
        print(f"📊 Sending order {order.order_id} to Google Sheets...")
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(settings.GOOGLE_SHEETS_WEBHOOK_URL, json=payload)
            print(f"✅ Sheets Response: {resp.status_code}")
    except Exception as e:
        print(f"❌ Sheets Error: {e}")
        pass
