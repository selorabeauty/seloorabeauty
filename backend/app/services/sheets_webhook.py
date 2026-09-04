import httpx
from datetime import datetime
from app.config import settings


async def send_to_sheets(order) -> None:
    if not settings.GOOGLE_SHEETS_WEBHOOK_URL:
        return
    payload = {
        "order_id":     order.order_id,
        "name":         order.name,
        "phone":        order.phone,
        "product":      order.product_name,
        "quantity":     order.quantity,
        "unit_price":   float(order.unit_price),
        "subtotal":     float(order.subtotal),
        "vat":          float(order.vat),
        "cod_fee":      float(order.cod_fee),
        "total":        float(order.total),
        "upsell":       "نعم" if order.upsell_accepted else "لا",
        "upsell_qty":   order.upsell_qty,
        "upsell_total": float(order.upsell_total or 0),
        "status":       "جديد",
        "created_at":   datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"),
        "source_url":   order.page_url or "",
        "ttclid":       order.ttclid or "",
        "sc_cid":       order.sc_cid or "",
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(settings.GOOGLE_SHEETS_WEBHOOK_URL, json=payload)
    except Exception:
        pass
