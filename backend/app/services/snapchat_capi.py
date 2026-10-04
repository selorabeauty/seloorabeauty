import hashlib
import logging
import time
import httpx
from app.config import settings

logger = logging.getLogger(__name__)

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def fire_snapchat_purchase(order) -> None:
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        logger.info("[snapchat-capi] skipped — token or pixel id not configured")
        return
    phone_e164 = "+966" + order.phone[1:]

    # Omit empty values — they reduce match quality
    user_data = {"ph": [sha256(phone_e164)]}
    if order.ip_address:
        user_data["client_ip_address"] = order.ip_address
    if order.user_agent:
        user_data["client_user_agent"] = order.user_agent
    if order.sc_cid:
        user_data["sc_click_id"] = order.sc_cid

    dedup_id = order.event_id or order.order_id
    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "data": [{
            "event_name": "PURCHASE",
            # Snap CAPI requires epoch MILLISECONDS (not seconds)
            "event_time": int(time.time() * 1000),
            "event_id": dedup_id,
            "client_dedup_id": dedup_id,
            "action_source": "WEB",
            "event_source_url": order.page_url or "https://seloorabeauty.shop/ar",
            "user_data": user_data,
            "custom_data": {
                "currency": "SAR",
                "value": str(float(order.total)),
                "order_id": order.order_id,
                "contents": [{
                    "id": order.product_id,
                    "quantity": str(order.quantity),
                    "item_price": str(float(order.unit_price)),
                }],
            },
        }],
    }
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                SNAP_CAPI_URL,
                json=payload,
                headers={"Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}"},
            )
            if resp.status_code in (200, 202):
                logger.info(f"[snapchat-capi] ✅ PURCHASE fired for {order.order_id}")
            else:
                logger.warning(f"[snapchat-capi] ❌ {resp.status_code} for {order.order_id}: {resp.text[:500]}")
    except Exception as e:
        logger.error(f"[snapchat-capi] ❌ request failed for {order.order_id}: {e}")
