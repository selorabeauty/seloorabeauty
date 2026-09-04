import hashlib
import time
import httpx
from app.config import settings

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def fire_tiktok_purchase(order) -> None:
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return
    # Normalize KSA phone to E.164: 05XXXXXXXX → +9665XXXXXXXX
    phone_e164 = "+966" + order.phone[1:]
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
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            await client.post(
                TIKTOK_CAPI_URL,
                json=payload,
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            )
    except Exception:
        pass  # fail silently — never block the order
