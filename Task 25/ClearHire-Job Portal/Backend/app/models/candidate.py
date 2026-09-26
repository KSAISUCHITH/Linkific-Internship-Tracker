from sqlalchemy import Column, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from app.database.base import Base


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
    )

    headline = Column(
        String(150),
        nullable=True,
    )

    bio = Column(
        Text,
        nullable=True,
    )

    location = Column(
        String(100),
        nullable=True,
    )

    skills = Column(
        Text,
        nullable=True,
    )

    resume_url = Column(
        String(500),
        nullable=True,
    )

    user = relationship(
        "User",
        backref="candidate_profile",
    )