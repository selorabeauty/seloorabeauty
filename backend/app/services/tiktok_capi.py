import hashlib
import logging
import time
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def fire_tiktok_purchase(order) -> None:
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        logger.info("[tiktok-capi] skipped — token or pixel id not configured")
        return
    # Normalize KSA phone to E.164: 05XXXXXXXX → +9665XXXXXXXX
    phone_e164 = "+966" + order.phone[1:]

    # Build user object — omit empty values (they hurt match quality / validation)
    user = {
        "phone": sha256(phone_e164),
    }
    if order.ttclid:
        user["ttclid"] = order.ttclid
    if order.ip_address:
        user["ip"] = order.ip_address
    if order.user_agent:
        user["user_agent"] = order.user_agent

    payload = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_ID,
        "data": [{
            "event": "CompletePayment",
            "event_time": int(time.time()),
            "event_id": order.event_id or order.order_id,
            "user": user,
            "page": {"url": order.page_url or "https://seloorabeauty.shop/ar"},
            "properties": {
                "currency": "SAR",
                "value": float(order.total),
                "content_type": "product",
                "contents": [{
                    "content_id": order.product_id,
                    "content_name": order.product_name,
                    "quantity": order.quantity,
                    "price": float(order.unit_price),
                }],
                "order_id": order.order_id,
            },
        }],
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                TIKTOK_CAPI_URL,
                json=payload,
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            )
            if resp.status_code == 200:
                logger.info(f"[tiktok-capi] ✅ CompletePayment fired for {order.order_id}")
            else:
                logger.warning(f"[tiktok-capi] ❌ {resp.status_code} for {order.order_id}: {resp.text[:500]}")
    except Exception as e:
        logger.error(f"[tiktok-capi] ❌ request failed for {order.order_id}: {e}")
