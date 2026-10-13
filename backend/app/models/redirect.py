import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, Integer, Text, DateTime
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class RedirectLink(Base):
    __tablename__ = "redirect_links"

    id          = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    slug        = Column(String(100), unique=True, nullable=False, index=True)
    destination = Column(Text, nullable=False)
    title       = Column(String(200), nullable=True)
    is_active   = Column(Boolean, default=True, nullable=False)
    clicks      = Column(Integer, default=0, nullable=False)
    created_at  = Column(DateTime, default=datetime.utcnow)
    updated_at  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
