import re
from pydantic import BaseModel, field_validator

KSA_PHONE_RE = re.compile(r"^05[0-9]{8}$")


class OrderCreate(BaseModel):
    name: str
    phone: str
    quantity: int = 1
    ttclid: str | None = None
    sc_cid: str | None = None
    event_id: str | None = None
    ip: str | None = None
    user_agent: str | None = None
    page_url: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_ksa_phone(cls, v: str) -> str:
        clean = v.replace(" ", "").replace("-", "")
        if not KSA_PHONE_RE.match(clean):
            raise ValueError("رقم الجوال غير صحيح — يجب أن يبدأ بـ 05 ويكون 10 أرقام")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("الاسم مطلوب")
        return v.strip()


class OrderResponse(BaseModel):
    order_id: str
    total: float
    status: str


class UpsellRequest(BaseModel):
    order_id: str
    accepted: bool
    quantity: int = 1


class UpsellResponse(BaseModel):
    order_id: str
    upsell_total: float
    new_total: float
