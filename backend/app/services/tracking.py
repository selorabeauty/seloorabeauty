"""
Page-view / click tracking with KSA + VPN filtering.
Uses MaxMind GeoIP2 Precision (already configured) for country.
Uses ip-api.com as a free VPN/proxy detector fallback.
"""
import asyncio
import hashlib
import httpx
from app.config import settings


async def _get_ip_info(ip: str) -> dict:
    """
    Returns {"country": "SA", "is_vpn": False}
    Uses MaxMind if configured, else falls back to ip-api.com.
    """
    if ip in ("127.0.0.1", "::1", ""):
        return {"country": "SA", "is_vpn": False}

    # ── MaxMind (primary) ──────────────────────────────────
    if settings.MAXMIND_ACCOUNT_ID and settings.MAXMIND_LICENSE_KEY:
        try:
            async with httpx.AsyncClient(timeout=4) as client:
                r = await client.get(
                    f"https://geolite.info/geoip/v2.1/city/{ip}",
                    auth=(settings.MAXMIND_ACCOUNT_ID, settings.MAXMIND_LICENSE_KEY),
                )
                d = r.json()
                country  = d.get("country", {}).get("iso_code", "")
                traits   = d.get("traits", {})
                is_vpn   = bool(
                    traits.get("is_anonymous_vpn") or
                    traits.get("is_hosting_provider") or
                    traits.get("is_tor_exit_node") or
                    traits.get("is_public_proxy") or
                    traits.get("is_residential_proxy")
                )
                return {"country": country, "is_vpn": is_vpn}
        except Exception:
            pass

    # ── ip-api.com fallback (free, 45 req/min) ────────────
    try:
        async with httpx.AsyncClient(timeout=4) as client:
            r = await client.get(
                f"http://ip-api.com/json/{ip}?fields=countryCode,proxy,hosting"
            )
            d = r.json()
            country = d.get("countryCode", "")
            is_vpn  = bool(d.get("proxy") or d.get("hosting"))
            return {"country": country, "is_vpn": is_vpn}
    except Exception:
        return {"country": "", "is_vpn": False}


async def record_event(
    db,
    event: str,
    ip: str,
    session_id: str,
    page_url: str = "",
    referrer: str = "",
    user_agent: str = "",
) -> bool:
    """
    Record a tracking event. Returns True if the event was counted
    (i.e. it's a valid KSA non-VPN IP).
    """
    info = await _get_ip_info(ip)
    is_ksa = info["country"] == "SA"
    is_vpn = info["is_vpn"]

    from sqlalchemy import text
    await db.execute(
        text("""
            INSERT INTO page_views
                (session_id, event, page_url, referrer, ip_address,
                 country, is_ksa, is_vpn, user_agent, created_at)
            VALUES
                (:sid, :event, :url, :ref, :ip,
                 :country, :is_ksa, :is_vpn, :ua, NOW())
        """),
        {
            "sid":     session_id,
            "event":   event,
            "url":     page_url[:500] if page_url else "",
            "ref":     referrer[:500] if referrer else "",
            "ip":      ip,
            "country": info["country"],
            "is_ksa":  is_ksa,
            "is_vpn":  is_vpn,
            "ua":      user_agent[:500] if user_agent else "",
        },
    )
    await db.commit()
    return is_ksa and not is_vpn
