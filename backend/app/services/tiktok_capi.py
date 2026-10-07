import hashlib
import logging
import os
import time
import httpx
from app.config import settings
from app.services import capi_log

logger = logging.getLogger(__name__)

TIKTOK_CAPI_URL = "https://business-api.tiktok.com/open_api/v1.3/event/track/"

# Optional: set TIKTOK_TEST_EVENT_CODE to route events into Events Manager
# "Test Events" tab instead of production reporting (from Events Manager →
# pixel → Test Events → generate code).
TEST_EVENT_CODE = os.environ.get("TIKTOK_TEST_EVENT_CODE", "")


def sha256(value: str) -> str:
    return hashlib.sha256(value.strip().lower().encode()).hexdigest()


async def diagnose() -> dict:
    """Fire a synthetic ViewContent and return TikTok's real API response —
    used by /api/debug/pixels to surface the exact error without log access."""
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return {"configured": False, "reason": "TIKTOK_ACCESS_TOKEN or TIKTOK_PIXEL_ID not set"}
    payload = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_ID,
        "data": [{
            "event": "ViewContent",
            "event_time": int(time.time()),
            "event_id": f"diag-{int(time.time())}",
            "user": {"ip": "8.8.8.8"},
            "page": {"url": "https://seloorabeauty.shop/ar"},
            "properties": {"currency": "SAR", "value": 1},
        }],
    }
    if TEST_EVENT_CODE:
        payload["test_event_code"] = TEST_EVENT_CODE
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                TIKTOK_CAPI_URL, json=payload,
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            )
        return {"configured": True, "http": resp.status_code, "tiktok_response": resp.json()}
    except Exception as e:
        return {"configured": True, "error": str(e)}


async def _post(payload: dict, label: str) -> None:
    """POST to TikTok Events API — reads the real result code from the body.

    TikTok returns HTTP 200 even for failed requests; success is code == 0
    in the JSON body. Anything else logs the actual error message.
    """
    if TEST_EVENT_CODE:
        payload["test_event_code"] = TEST_EVENT_CODE
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                TIKTOK_CAPI_URL,
                json=payload,
                headers={"Access-Token": settings.TIKTOK_ACCESS_TOKEN},
            )
        try:
            body = resp.json()
        except Exception:
            body = {}
        code = body.get("code")
        ok = resp.status_code == 200 and code == 0
        detail = {"http": resp.status_code, "code": code,
                  "message": body.get("message") if isinstance(body, dict) else resp.text[:300]}
        if ok:
            logger.info(f"[tiktok-capi] ✅ {label} delivered")
        else:
            logger.warning(
                f"[tiktok-capi] ❌ {label} http={resp.status_code} "
                f"code={code} msg={detail['message']}"
            )
        capi_log.record("tiktok", label.split()[0], label.split()[-1], ok, detail)
    except Exception as e:
        logger.error(f"[tiktok-capi] ❌ {label} request failed: {e}")
        capi_log.record("tiktok", label.split()[0], label.split()[-1], False, {"error": str(e)})


def _base_user(ip: str, ua: str, ttclid: str | None, ttp: str | None) -> dict:
    user = {}
    if ttclid:
        user["ttclid"] = ttclid
    if ttp:
        user["ttp"] = ttp
    if ip:
        user["ip"] = ip
    if ua:
        user["user_agent"] = ua
    return user


async def fire_tiktok_purchase(order) -> None:
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        logger.info("[tiktok-capi] skipped — token or pixel id not configured")
        return
    # Normalize KSA phone to E.164: 05XXXXXXXX → +9665XXXXXXXX
    phone_e164 = "+966" + order.phone[1:]

    user = {"phone": sha256(phone_e164)}
    user.update(_base_user(order.ip_address or "", order.user_agent or "",
                           order.ttclid, order.ttp))

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
    await _post(payload, f"CompletePayment {order.order_id}")


# Map internal funnel event names → TikTok standard events.
# PageView is intentionally excluded: ttq.page() can't carry an event_id,
# so a CAPI mirror could never dedupe → double counting. Browser-only.
TT_EVENTS = {
    "view_content":   "ViewContent",
    "add_to_cart":    "AddToCart",
    "checkout_start": "InitiateCheckout",
}


async def fire_tiktok_event(event: str, event_id: str, click_ids: dict,
                            ip: str, ua: str, url: str, value: float | None = None,
                            product_id: str | None = None) -> None:
    """Server-side mirror of a browser funnel event — same event_id = deduped."""
    if not settings.TIKTOK_ACCESS_TOKEN or not settings.TIKTOK_PIXEL_ID:
        return
    tt_event = TT_EVENTS.get(event)
    if not tt_event or not event_id:
        return

    user = _base_user(ip, ua, click_ids.get("ttclid"), click_ids.get("ttp"))

    properties = {"currency": "SAR"}
    if value:
        properties["value"] = float(value)
    if product_id:
        properties["content_type"] = "product"
        properties["contents"] = [{"content_id": product_id, "quantity": 1}]

    payload = {
        "event_source": "web",
        "event_source_id": settings.TIKTOK_PIXEL_ID,
        "data": [{
            "event": tt_event,
            "event_time": int(time.time()),
            "event_id": event_id,
            "user": user,
            "page": {"url": url or "https://seloorabeauty.shop/ar"},
            "properties": properties,
        }],
    }
    await _post(payload, f"{tt_event} {event_id}")
