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

    # Normalize phone: both "+9665..." and "9665..." to maximize Snap match rate
    raw_digits = "".join(c for c in order.phone if c.isdigit())
    if raw_digits.startswith("0"):
        digits_e164 = "966" + raw_digits[1:]
    elif not raw_digits.startswith("966"):
        digits_e164 = "966" + raw_digits
    else:
        digits_e164 = raw_digits

    phone_hashes = [sha256("+" + digits_e164), sha256(digits_e164)]
    user_data = {"ph": phone_hashes}

    if order.name:
        parts = order.name.strip().split()
        if len(parts) >= 1 and parts[0]:
            user_data["fn"] = [sha256(parts[0])]
        if len(parts) >= 2 and parts[1]:
            user_data["ln"] = [sha256(" ".join(parts[1:]))]

    if order.city:
        user_data["ct"] = [sha256(order.city.strip().lower())]

    user_data["country"] = [sha256("sa")]

    if order.ip_address:
        user_data["client_ip_address"] = order.ip_address
    if order.user_agent:
        user_data["client_user_agent"] = order.user_agent
    if order.sc_cid:
        user_data["sc_click_id"] = order.sc_cid
    if order.sc_cookie1:
        user_data["sc_cookie1"] = order.sc_cookie1

    items = order.items or []
    if items:
        item_ids = [str(i.get("sku") or i.get("id") or order.product_id) for i in items]
        contents = [
            {
                "id": str(i.get("sku") or i.get("id") or order.product_id),
                "quantity": str(i.get("quantity") or 1),
                "item_price": str(float(i.get("price") or order.unit_price)),
            }
            for i in items
        ]
        num_items = str(sum(int(i.get("quantity") or 1) for i in items))
    else:
        item_ids = [order.product_id]
        contents = [{
            "id": order.product_id,
            "quantity": str(order.quantity),
            "item_price": str(float(order.unit_price)),
        }]
        num_items = str(order.quantity)

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
            "item_ids": item_ids,
            "number_items": num_items,
            "contents": contents,
            "item_category": "skincare",
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

    # Advanced matching PII signals if captured earlier in session
    raw_phone = click_ids.get("user_phone")
    if raw_phone:
        raw_digits = "".join(c for c in str(raw_phone) if c.isdigit())
        if raw_digits:
            clean_digits = raw_digits if raw_digits.startswith("966") else "966" + raw_digits.lstrip("0")
            user_data["ph"] = [sha256("+" + clean_digits), sha256(clean_digits)]

    user_name = click_ids.get("user_name")
    if user_name:
        parts = str(user_name).strip().split()
        if len(parts) >= 1 and parts[0]:
            user_data["fn"] = [sha256(parts[0])]

    user_email = click_ids.get("user_email")
    if user_email and "@" in str(user_email):
        user_data["em"] = [sha256(str(user_email).strip().lower())]

    user_data["country"] = [sha256("sa")]

    custom_data = {"currency": "SAR", "item_category": "skincare"}
    if value:
        custom_data["value"] = str(float(value))
    if product_id:
        custom_data["item_ids"] = [product_id]
        custom_data["number_items"] = "1"
        custom_data["contents"] = [{
            "id": product_id,
            "quantity": "1",
            "item_price": str(float(value or 0)),
        }]

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
