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


class Interview(Base):
    __tablename__ = "interviews"

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

    interview_type = Column(
        String(50),
        nullable=False,
    )

    scheduled_at = Column(
        DateTime(timezone=True),
        nullable=False,
    )

    duration_minutes = Column(
        Integer,
        nullable=True,
    )

    meeting_link = Column(
        String(500),
        nullable=True,
    )

    notes = Column(
        Text,
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    application = relationship(
        "Application",
        back_populates="interviews",
    )