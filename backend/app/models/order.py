import uuid
from datetime import datetime
from sqlalchemy import Column, String, Numeric, Boolean, Integer, Text, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class Order(Base):
    __tablename__ = "orders"

    id              = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    order_id        = Column(String(50), unique=True, nullable=False)
    name            = Column(String(200), nullable=False)
    phone           = Column(String(20), nullable=False)
    city            = Column(String(100))
    district        = Column(String(200))
    address         = Column(Text)
    payment_method  = Column(String(50), nullable=False, default="cod")
    product_id      = Column(String(100), nullable=False, default="set-complete")
    product_name    = Column(String(300), nullable=False, default="سيروم علاج تشققات الجسم + كريم علاج تشققات الجسم")
    items           = Column(JSON)  # [{sku, name, quantity, price}, ...]
    quantity        = Column(Integer, nullable=False, default=1)
    unit_price      = Column(Numeric(10, 2), nullable=False)
    subtotal        = Column(Numeric(10, 2), nullable=False)
    vat             = Column(Numeric(10, 2), nullable=False)
    cod_fee         = Column(Numeric(10, 2), nullable=False, default=0)
    total           = Column(Numeric(10, 2), nullable=False)
    status          = Column(String(50), nullable=False, default="pending")
    upsell_accepted = Column(Boolean, default=False)
    upsell_qty      = Column(Integer, default=0)
    upsell_total    = Column(Numeric(10, 2), default=0)
    # Pixel tracking
    ttclid          = Column(String(500))
    sc_cid          = Column(String(500))
    event_id        = Column(String(200))
    ip_address      = Column(String(45))
    user_agent      = Column(Text)
    page_url        = Column(Text)
    # Timestamps
    created_at      = Column(DateTime, default=datetime.utcnow)
    updated_at      = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
