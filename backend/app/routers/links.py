import base64
import secrets
import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Header, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, desc

from app.database import get_db
from app.config import settings
from app.models.redirect import RedirectLink
from app.schemas.redirect import RedirectCreate, RedirectUpdate, RedirectResponse

router = APIRouter(prefix="/links", tags=["links"])


def verify_links_auth(request: Request):
    """Authenticate with dedicated LINKS_ADMIN_PASSWORD.
    Accepts X-Links-Password header, or Authorization: Bearer <password>, or Basic auth.
    """
    configured_pass = settings.LINKS_ADMIN_PASSWORD or "selora-links-2026"
    provided_pass = None

    # 1. Custom header
    custom_hdr = request.headers.get("X-Links-Password")
    if custom_hdr:
        provided_pass = custom_hdr.strip()

    # 2. Authorization header
    auth_hdr = request.headers.get("Authorization")
    if not provided_pass and auth_hdr:
        parts = auth_hdr.strip().split()
        if len(parts) == 2:
            scheme, token = parts[0].lower(), parts[1]
            if scheme == "bearer":
                provided_pass = token
            elif scheme == "basic":
                try:
                    decoded = base64.b64decode(token).decode("utf-8")
                    # user:pass or just pass
                    provided_pass = decoded.split(":")[-1]
                except Exception:
                    pass
        elif len(parts) == 1:
            provided_pass = parts[0]

    if not provided_pass or not secrets.compare_digest(provided_pass.encode("utf-8"), configured_pass.encode("utf-8")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="كلمة المرور غير صحيحة",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return True


# ── Public redirect lookup (used by /ads/[slug]) ─────────

@router.get("/public/{slug}")
async def get_public_link(slug: str, db: AsyncSession = Depends(get_db)):
    clean_slug = slug.strip().lower()
    stmt = select(RedirectLink).where(RedirectLink.slug == clean_slug)
    result = await db.execute(stmt)
    link = result.scalar_one_or_none()

    if not link:
        raise HTTPException(status_code=404, detail="الرابط غير موجود")
    if not link.is_active:
        raise HTTPException(status_code=404, detail="الرابط معطل حالياً")

    # Increment click counter non-blocking / synchronously in DB
    try:
        link.clicks = (link.clicks or 0) + 1
        await db.commit()
    except Exception:
        await db.rollback()

    return {
        "slug": link.slug,
        "destination": link.destination,
        "is_active": link.is_active,
    }


# ── Admin endpoints (Protected by LINKS_ADMIN_PASSWORD) ──

@router.post("/verify")
async def verify_auth(_: bool = Depends(verify_links_auth)):
    return {"ok": True, "message": "مصادقة صحيحة"}


@router.get("", response_model=list[RedirectResponse])
async def list_links(
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_links_auth),
):
    stmt = select(RedirectLink).order_by(desc(RedirectLink.created_at))
    result = await db.execute(stmt)
    links = result.scalars().all()
    return [
        RedirectResponse(
            id=str(l.id),
            slug=l.slug,
            destination=l.destination,
            title=l.title,
            is_active=l.is_active,
            clicks=l.clicks or 0,
            created_at=l.created_at,
            updated_at=l.updated_at,
        )
        for l in links
    ]


@router.post("", response_model=RedirectResponse, status_code=status.HTTP_201_CREATED)
async def create_link(
    payload: RedirectCreate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_links_auth),
):
    # Check uniqueness
    existing = await db.execute(select(RedirectLink).where(RedirectLink.slug == payload.slug))
    if existing.scalar_one_or_none():
        raise HTTPException(status_code=400, detail=f"الرمز '{payload.slug}' مستخدم بالفعل، اختر رمزاً آخر")

    new_link = RedirectLink(
        slug=payload.slug,
        destination=payload.destination,
        title=payload.title,
        is_active=payload.is_active,
        clicks=0,
    )
    db.add(new_link)
    await db.commit()
    await db.refresh(new_link)

    return RedirectResponse(
        id=str(new_link.id),
        slug=new_link.slug,
        destination=new_link.destination,
        title=new_link.title,
        is_active=new_link.is_active,
        clicks=new_link.clicks or 0,
        created_at=new_link.created_at,
        updated_at=new_link.updated_at,
    )


@router.put("/{link_id}", response_model=RedirectResponse)
async def update_link(
    link_id: str,
    payload: RedirectUpdate,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_links_auth),
):
    try:
        uid = uuid.UUID(link_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="معرف الرابط غير صالح")

    result = await db.execute(select(RedirectLink).where(RedirectLink.id == uid))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="الرابط غير موجود")

    if payload.slug is not None and payload.slug != link.slug:
        existing = await db.execute(
            select(RedirectLink).where(RedirectLink.slug == payload.slug, RedirectLink.id != uid)
        )
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail=f"الرمز '{payload.slug}' مستخدم بالفعل لـ رابط آخر")
        link.slug = payload.slug

    if payload.destination is not None:
        link.destination = payload.destination
    if payload.title is not None:
        link.title = payload.title
    if payload.is_active is not None:
        link.is_active = payload.is_active

    link.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(link)

    return RedirectResponse(
        id=str(link.id),
        slug=link.slug,
        destination=link.destination,
        title=link.title,
        is_active=link.is_active,
        clicks=link.clicks or 0,
        created_at=link.created_at,
        updated_at=link.updated_at,
    )


@router.delete("/{link_id}")
async def delete_link(
    link_id: str,
    db: AsyncSession = Depends(get_db),
    _: bool = Depends(verify_links_auth),
):
    try:
        uid = uuid.UUID(link_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="معرف الرابط غير صالح")

    result = await db.execute(select(RedirectLink).where(RedirectLink.id == uid))
    link = result.scalar_one_or_none()
    if not link:
        raise HTTPException(status_code=404, detail="الرابط غير موجود")

    await db.delete(link)
    await db.commit()
    return {"ok": True, "message": "تم حذف الرابط بنجاح"}
