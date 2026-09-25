from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
)
from sqlalchemy.orm import relationship

from app.database.base import Base


class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    application_id = Column(
        Integer,
        ForeignKey(
            "applications.id",
            ondelete="CASCADE",
        ),
        nullable=False,
    )

    status = Column(
        String(50),
        nullable=False,
    )

    note = Column(
        Text,
        nullable=True,
    )

    changed_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    application = relationship(
        "Application",
        back_populates="status_history",
    )