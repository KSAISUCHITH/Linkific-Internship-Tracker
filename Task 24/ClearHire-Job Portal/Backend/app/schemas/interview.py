from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class InterviewCreate(BaseModel):
    application_id: int = Field(
        ...,
        gt=0,
    )

    interview_type: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    scheduled_at: datetime

    duration_minutes: int | None = Field(
        default=None,
        gt=0,
    )

    meeting_link: str | None = Field(
        default=None,
        max_length=500,
    )

    notes: str | None = None


class InterviewUpdate(BaseModel):
    interview_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    scheduled_at: datetime | None = None

    duration_minutes: int | None = Field(
        default=None,
        gt=0,
    )

    meeting_link: str | None = Field(
        default=None,
        max_length=500,
    )

    notes: str | None = None


class InterviewResponse(BaseModel):
    id: int
    application_id: int
    interview_type: str
    scheduled_at: datetime
    duration_minutes: int | None
    meeting_link: str | None
    notes: str | None
    created_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )