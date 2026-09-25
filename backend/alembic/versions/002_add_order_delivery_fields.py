"""add city/district/address/payment_method/items to orders

Revision ID: 002
Revises: 001
Create Date: 2026-09-24
"""
from alembic import op
import sqlalchemy as sa

revision = '002'
down_revision = '001'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('orders', sa.Column('city', sa.String(100)))
    op.add_column('orders', sa.Column('district', sa.String(200)))
    op.add_column('orders', sa.Column('address', sa.Text))
    op.add_column('orders', sa.Column('payment_method', sa.String(50), nullable=False, server_default='cod'))
    op.add_column('orders', sa.Column('items', sa.JSON))
    op.alter_column('orders', 'product_id', server_default='set-complete')
    op.alter_column('orders', 'product_name', type_=sa.String(300), server_default='سيروم علاج تشققات الجسم + كريم علاج تشققات الجسم')
    op.alter_column('orders', 'cod_fee', server_default='0')


def downgrade() -> None:
    op.drop_column('orders', 'items')
    op.drop_column('orders', 'payment_method')
    op.drop_column('orders', 'address')
    op.drop_column('orders', 'district')
    op.drop_column('orders', 'city')
