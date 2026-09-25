from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ApplicationCreate(BaseModel):
    job_id: int = Field(
        ...,
        gt=0,
    )

    expected_response_days: int | None = Field(
        default=None,
        gt=0,
    )


class ApplicationUpdate(BaseModel):
    status: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    expected_response_days: int | None = Field(
        default=None,
        gt=0,
    )


class ApplicationResponse(BaseModel):
    id: int
    candidate_id: int
    job_id: int
    status: str
    applied_at: datetime
    expected_response_days: int | None

    model_config = ConfigDict(
        from_attributes=True,
    )