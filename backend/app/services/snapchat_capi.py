import hashlib
import time
import httpx
from app.config import settings

SNAP_CAPI_URL = "https://tr.snapchat.com/v2/conversion"


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def fire_snapchat_purchase(order) -> None:
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return
    phone_e164 = "+966" + order.phone[1:]
    payload = {
        "pixel_id": settings.SNAPCHAT_PIXEL_ID,
        "data": [{
            "event_name": "PURCHASE",
            "event_time": int(time.time()),
            "event_id": order.event_id or str(order.id),
            "action_source": "WEB",
            "event_source_url": order.page_url or "https://sellurabeauty.shop/ar",
            "user_data": {
                "ph": [sha256(phone_e164)],
                "client_ip_address": order.ip_address or "",
                "client_user_agent": order.user_agent or "",
                "sc_click_id": order.sc_cid or "",
            },
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
            await client.post(
                SNAP_CAPI_URL,
                json=payload,
                headers={"Authorization": f"Bearer {settings.SNAPCHAT_ACCESS_TOKEN}"},
            )
    except Exception:
        pass
