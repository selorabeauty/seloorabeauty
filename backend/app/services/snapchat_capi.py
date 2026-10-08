import hashlib
import logging
import time
import httpx
from app.config import settings
from app.services import capi_log

logger = logging.getLogger(__name__)

# Snap CAPI v3 — pixel_id goes in the URL PATH, access token is a query
# param, event_time is epoch SECONDS, body is {"data": [...]}.
SNAP_CAPI_URL = "https://tr.snapchat.com/v3/{pixel_id}/events"


async def _post(event: dict, label: str) -> None:
    """POST one event to Snap CAPI v3; 200/202 = accepted."""
    url = SNAP_CAPI_URL.format(pixel_id=settings.SNAPCHAT_PIXEL_ID)
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                url,
                params={"access_token": settings.SNAPCHAT_ACCESS_TOKEN},
                json={"data": [event]},
            )
        ok = resp.status_code in (200, 202)
        if ok:
            logger.info(f"[snapchat-capi] ✅ {label} delivered")
        else:
            logger.warning(f"[snapchat-capi] ❌ {label} {resp.status_code}: {resp.text[:300]}")
        capi_log.record("snapchat", label.split()[0], label.split()[-1], ok,
                        {"http": resp.status_code, "body": resp.text[:300]})
    except Exception as e:
        logger.error(f"[snapchat-capi] ❌ {label} request failed: {e}")
        capi_log.record("snapchat", label.split()[0], label.split()[-1], False, {"error": str(e)})


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
    if order.sc_cookie1:
        user_data["sc_cookie1"] = order.sc_cookie1

    dedup_id = order.event_id or order.order_id
    event = {
        "event_name": "PURCHASE",
        "event_time": int(time.time()),   # v3 uses epoch SECONDS
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
    }
    await _post(event, f"PURCHASE {order.order_id}")


async def diagnose() -> dict:
    """Fire a synthetic PAGE_VIEW and return Snap's real API response."""
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return {"configured": False, "reason": "SNAPCHAT_ACCESS_TOKEN or SNAPCHAT_PIXEL_ID not set"}
    url = SNAP_CAPI_URL.format(pixel_id=settings.SNAPCHAT_PIXEL_ID)
    payload = {"data": [{
        "event_name": "PAGE_VIEW",
        "event_time": int(time.time()),
        "event_id": f"diag-{int(time.time())}",
        "action_source": "WEB",
        "event_source_url": "https://seloorabeauty.shop/ar",
        "user_data": {"client_ip_address": "8.8.8.8"},
        "custom_data": {"currency": "SAR"},
    }]}
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                url, json=payload,
                params={"access_token": settings.SNAPCHAT_ACCESS_TOKEN},
            )
        try:
            body = resp.json()
        except Exception:
            body = resp.text[:300]
        return {"configured": True, "http": resp.status_code, "snap_response": body}
    except Exception as e:
        return {"configured": True, "error": str(e)}


# Map internal funnel event names → Snap standard events
SNAP_EVENTS = {
    "view_content":     "VIEW_CONTENT",
    "add_to_cart":      "ADD_CART",
    "checkout_start":   "START_CHECKOUT",
    "add_payment_info": "ADD_BILLING",
    "pageview":         "PAGE_VIEW",
}


async def fire_snap_event(event: str, event_id: str, click_ids: dict,
                          ip: str, ua: str, url: str, value: float | None = None,
                          product_id: str | None = None) -> None:
    """Server-side mirror of a browser funnel event — same event_id = deduped."""
    if not settings.SNAPCHAT_ACCESS_TOKEN or not settings.SNAPCHAT_PIXEL_ID:
        return
    snap_event = SNAP_EVENTS.get(event)
    if not snap_event:
        return

    user_data = {}
    if ip:
        user_data["client_ip_address"] = ip
    if ua:
        user_data["client_user_agent"] = ua
    if click_ids.get("sc_cid"):
        user_data["sc_click_id"] = click_ids["sc_cid"]
    if click_ids.get("sc_cookie1"):
        user_data["sc_cookie1"] = click_ids["sc_cookie1"]

    custom_data = {"currency": "SAR"}
    if value:
        custom_data["value"] = str(float(value))
    if product_id:
        custom_data["item_ids"] = [product_id]

    event = {
        "event_name": snap_event,
        "event_time": int(time.time()),   # v3: epoch seconds
        "event_id": event_id,
        "client_dedup_id": event_id,
        "action_source": "WEB",
        "event_source_url": url or "https://seloorabeauty.shop/ar",
        "user_data": user_data,
        "custom_data": custom_data,
    }
    await _post(event, f"{snap_event} {event_id}")
