"""
MaxMind GeoIP2 — verify visitor is from Saudi Arabia.
Uses the GeoIP2 Web Service (Precision) API.
"""
import httpx
from app.config import settings


async def get_country(ip: str) -> str:
    """Return ISO country code for the given IP, or '' on error."""
    if not settings.MAXMIND_ACCOUNT_ID or not settings.MAXMIND_LICENSE_KEY:
        return ""
    if ip in ("127.0.0.1", "::1", ""):
        return "SA"  # localhost → treat as Saudi for dev
    try:
        url = f"https://geolite.info/geoip/v2.1/country/{ip}"
        async with httpx.AsyncClient(timeout=5) as client:
            resp = await client.get(
                url,
                auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
            )
            data = resp.json()
            return data.get("country", {}).get("iso_code", "")
    except Exception:
        return ""


async def is_saudi(ip: str) -> bool:
    """Return True if the IP is from Saudi Arabia."""
    code = await get_country(ip)
    return code == "SA"
