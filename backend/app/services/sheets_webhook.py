import httpx
from datetime import datetime
from app.config import settings


async def send_to_sheets(order) -> None:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        return
    payload = {
        "date":        datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "order id":    order.order_id,
        "country":     "SA",
        "name":        order.name,
        "phone":       order.phone,
        "product":     order.product_name,
        "sku":         order.product_id,
        "quantity":    order.quantity,
        "total price": float(order.total),
        "statut":      "جديد",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(settings.GOOGLE_SHEETS_WEBHOOK_URL, json=payload)
    except Exception:
        pass
