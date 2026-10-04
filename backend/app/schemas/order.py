import re
from pydantic import BaseModel, field_validator

KSA_PHONE_RE = re.compile(r"^0[0-9]{9}$")
PAYMENT_METHODS = {"cod", "tabby_tamara", "apple_pay_mada"}


class OrderItem(BaseModel):
    sku: str
    name: str
    quantity: int = 1
    price: float


class OrderCreate(BaseModel):
    name: str
    phone: str
    city: str | None = None
    district: str | None = None
    address: str | None = None
    payment_method: str = "cod"
    quantity: int = 1
    total: float | None = None
    items: list[OrderItem] = []
    ttclid: str | None = None
    sc_cid: str | None = None
    ttp: str | None = None
    sc_cookie1: str | None = None
    event_id: str | None = None
    ip: str | None = None
    user_agent: str | None = None
    page_url: str | None = None

    @field_validator("phone")
    @classmethod
    def validate_ksa_phone(cls, v: str) -> str:
        clean = v.replace(" ", "").replace("-", "")
        if not KSA_PHONE_RE.match(clean):
            raise ValueError("رقم الجوال غير صحيح — يجب أن يبدأ بـ 0 ويكون 10 أرقام")
        return clean

    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if len(v.strip()) < 2:
            raise ValueError("الاسم مطلوب")
        return v.strip()

    @field_validator("payment_method")
    @classmethod
    def validate_payment_method(cls, v: str) -> str:
        if v not in PAYMENT_METHODS:
            raise ValueError(f"طريقة دفع غير صحيحة — يجب أن تكون واحدة من: {', '.join(PAYMENT_METHODS)}")
        return v



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
