import asyncio
import random
import string
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.order import Order
from app.config import settings
from app.services.tiktok_capi import fire_tiktok_purchase
from app.services.snapchat_capi import fire_snapchat_purchase
from app.services.sheets_webhook import send_to_sheets


def generate_order_id() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"SLR-{suffix}"


async def create_order(db: AsyncSession, data: dict) -> Order:
    price    = settings.HERO_PRICE
    qty      = data.get("quantity", 1)
    subtotal = price * qty
    vat      = round(subtotal * settings.VAT_RATE, 2)
    total    = subtotal + vat + settings.COD_FEE

    order = Order(
        order_id     = generate_order_id(),
        name         = data["name"],
        phone        = data["phone"],
        quantity     = qty,
        unit_price   = price,
        subtotal     = subtotal,
        vat          = vat,
        cod_fee      = settings.COD_FEE,
        total        = total,
        ttclid       = data.get("ttclid"),
        sc_cid       = data.get("sc_cid"),
        event_id     = data.get("event_id"),
        ip_address   = data.get("ip"),
        user_agent   = data.get("user_agent"),
        page_url     = data.get("page_url"),
    )
    db.add(order)
    await db.commit()
    await db.refresh(order)

    # Fire pixels + sheets non-blocking
    asyncio.create_task(fire_tiktok_purchase(order))
    asyncio.create_task(fire_snapchat_purchase(order))
    asyncio.create_task(send_to_sheets(order))

    return order


async def accept_upsell(db: AsyncSession, order_id: str, qty: int = 1) -> Order:
    result = await db.execute(select(Order).where(Order.order_id == order_id))
    order = result.scalar_one_or_none()
    if not order:
        raise ValueError("Order not found")

    upsell_total           = settings.UPSELL_PRICE * qty
    order.upsell_accepted  = True
    order.upsell_qty       = qty
    order.upsell_total     = upsell_total
    order.total            = float(order.total) + upsell_total
    order.updated_at       = datetime.utcnow()

    await db.commit()
    await db.refresh(order)
    return order
