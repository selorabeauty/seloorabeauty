"""
Direct Google Sheets API v4 integration via service account.
service-account.json is written by start.sh at container startup.
"""
import asyncio
import json
import os
from datetime import datetime, timezone

import httpx

from app.config import settings

_SA_PATH = "/app/service-account.json"
_SPREADSHEET_ID = "1MryK9DrpLRKQ2PeIf2jc160_WhRVNGqzrACnwou54q8"  # hardcoded fallback
_cached_token: dict = {"token": None, "expires_at": 0}


async def _get_access_token() -> str:
    import time
    if _cached_token["token"] and time.time() < _cached_token["expires_at"] - 60:
        return _cached_token["token"]

    from google.oauth2 import service_account
    import google.auth.transport.requests

    with open(_SA_PATH) as f:
        sa_info = json.load(f)

    creds = service_account.Credentials.from_service_account_info(
        sa_info,
        scopes=["https://www.googleapis.com/auth/spreadsheets"],
    )
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(None, creds.refresh, google.auth.transport.requests.Request())

    _cached_token["token"] = creds.token
    _cached_token["expires_at"] = creds.expiry.timestamp() if creds.expiry else 0
    return creds.token


def _format_phone(raw: str) -> str:
    phone = raw.replace(" ", "").replace("-", "")
    if phone.startswith("966"):
        return phone
    if phone.startswith("0"):
        return "966" + phone[1:]
    return "966" + phone


def _build_row(order) -> list:
    try:
        from zoneinfo import ZoneInfo
        now_sa = datetime.now(timezone.utc).astimezone(ZoneInfo("Asia/Riyadh"))
    except Exception:
        now_sa = datetime.utcnow()

    items = order.items or []
    if items:
        products   = "/".join(i.get("name", "")         for i in items)
        skus       = "/".join(i.get("sku", "")          for i in items)
        quantities = "/".join(str(i.get("quantity", 1)) for i in items)
    else:
        products   = order.product_name or ""
        skus       = order.product_id   or ""
        quantities = str(order.quantity)

    return [
        now_sa.strftime("%d/%m/%Y"),
        order.order_id,
        order.name,
        _format_phone(order.phone),
        order.city     or "",
        (order.address or "").strip(),
        "KSA",
        products,
        quantities,
        skus,
        "",
        "SAR",
        float(order.total),
    ]


async def send_to_sheets(order) -> None:
    # Use env var if set, otherwise fall back to hardcoded ID
    spreadsheet_id = settings.GOOGLE_SPREADSHEET_ID or _SPREADSHEET_ID

    if not os.path.exists(_SA_PATH):
        print(f"⚠️  service-account.json not found at {_SA_PATH} — skipping {order.order_id}")
        return

    try:
        print(f"📊 Writing order {order.order_id} to Google Sheets...")
        token = await _get_access_token()
        row   = _build_row(order)

        url = (
            f"https://sheets.googleapis.com/v4/spreadsheets/{spreadsheet_id}"
            f"/values/A1:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS"
        )
        async with httpx.AsyncClient(timeout=15) as client:
            resp = await client.post(
                url,
                json={"values": [row]},
                headers={"Authorization": f"Bearer {token}"},
            )

        if resp.status_code == 200:
            updated = resp.json().get("updates", {}).get("updatedRange", "")
            print(f"✅ Order {order.order_id} → Google Sheets {updated}")
        else:
            print(f"⚠️  Sheets API {resp.status_code} for {order.order_id}: {resp.text[:200]}")

    except Exception as exc:
        print(f"❌ Sheets error for {order.order_id}: {exc}")
