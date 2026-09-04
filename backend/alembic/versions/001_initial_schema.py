"""initial schema

Revision ID: 001
Revises: 
Create Date: 2026-08-25
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID

revision = '001'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'orders',
        sa.Column('id', UUID(as_uuid=True), primary_key=True, server_default=sa.text('gen_random_uuid()')),
        sa.Column('order_id', sa.String(50), unique=True, nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.Column('product_id', sa.String(100), nullable=False, server_default='retinal-serum-150ml'),
        sa.Column('product_name', sa.String(200), nullable=False, server_default='سيروم الريتينال المُجدِّد ١٥٠مل'),
        sa.Column('quantity', sa.Integer, nullable=False, server_default='1'),
        sa.Column('unit_price', sa.Numeric(10, 2), nullable=False),
        sa.Column('subtotal', sa.Numeric(10, 2), nullable=False),
        sa.Column('vat', sa.Numeric(10, 2), nullable=False),
        sa.Column('cod_fee', sa.Numeric(10, 2), nullable=False, server_default='20'),
        sa.Column('total', sa.Numeric(10, 2), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='pending'),
        sa.Column('upsell_accepted', sa.Boolean, server_default='false'),
        sa.Column('upsell_qty', sa.Integer, server_default='0'),
        sa.Column('upsell_total', sa.Numeric(10, 2), server_default='0'),
        sa.Column('ttclid', sa.String(500)),
        sa.Column('sc_cid', sa.String(500)),
        sa.Column('event_id', sa.String(200)),
        sa.Column('ip_address', sa.String(45)),
        sa.Column('user_agent', sa.Text),
        sa.Column('page_url', sa.Text),
        sa.Column('created_at', sa.DateTime, server_default=sa.text('NOW()')),
        sa.Column('updated_at', sa.DateTime, server_default=sa.text('NOW()')),
    )
    op.create_index('ix_orders_order_id', 'orders', ['order_id'])
    op.create_index('ix_orders_phone', 'orders', ['phone'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])


def downgrade() -> None:
    op.drop_table('orders')
