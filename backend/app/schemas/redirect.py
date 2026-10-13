import re
from datetime import datetime
from pydantic import BaseModel, field_validator


SLUG_REGEX = re.compile(r"^[a-zA-Z0-9_\-]+$")


class RedirectCreate(BaseModel):
    slug: str
    destination: str
    title: str | None = None
    is_active: bool = True

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str) -> str:
        s = v.strip().lower()
        if not s:
            raise ValueError("الرمز (slug) مطلوب")
        if not SLUG_REGEX.match(s):
            raise ValueError("الرمز يجب أن يحتوي فقط على أحرف إنجليزية وأرقام وشرطات (-_)")
        return s

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, v: str) -> str:
        d = v.strip()
        if not d:
            raise ValueError("الرابط المستهدف (destination) مطلوب")
        # Ensure it starts with / or http
        if not (d.startswith("/") or d.startswith("http://") or d.startswith("https://")):
            d = "/" + d
        return d


class RedirectUpdate(BaseModel):
    slug: str | None = None
    destination: str | None = None
    title: str | None = None
    is_active: bool | None = None

    @field_validator("slug")
    @classmethod
    def validate_slug(cls, v: str | None) -> str | None:
        if v is None:
            return None
        s = v.strip().lower()
        if not s:
            raise ValueError("الرمز (slug) لا يمكن أن يكون فارغاً")
        if not SLUG_REGEX.match(s):
            raise ValueError("الرمز يجب أن يحتوي فقط على أحرف إنجليزية وأرقام وشرطات (-_)")
        return s

    @field_validator("destination")
    @classmethod
    def validate_destination(cls, v: str | None) -> str | None:
        if v is None:
            return None
        d = v.strip()
        if not d:
            raise ValueError("الرابط المستهدف لا يمكن أن يكون فارغاً")
        if not (d.startswith("/") or d.startswith("http://") or d.startswith("https://")):
            d = "/" + d
        return d


class RedirectResponse(BaseModel):
    id: str
    slug: str
    destination: str
    title: str | None = None
    is_active: bool
    clicks: int
    created_at: datetime | None = None
    updated_at: datetime | None = None
