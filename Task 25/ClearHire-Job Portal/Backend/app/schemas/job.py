from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class JobCreate(BaseModel):
    title: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    description: str = Field(
        ...,
        min_length=10,
    )

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    employment_type: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    experience_level: str | None = Field(
        default=None,
        max_length=50,
    )

    salary_min: int | None = Field(
        default=None,
        ge=0,
    )

    salary_max: int | None = Field(
        default=None,
        ge=0,
    )

    skills: str | None = None

    application_deadline: datetime | None = None


class JobUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = Field(
        default=None,
        min_length=10,
    )

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    employment_type: str | None = Field(
        default=None,
        min_length=2,
        max_length=50,
    )

    experience_level: str | None = Field(
        default=None,
        max_length=50,
    )

    salary_min: int | None = Field(
        default=None,
        ge=0,
    )

    salary_max: int | None = Field(
        default=None,
        ge=0,
    )

    skills: str | None = None

    application_deadline: datetime | None = None


class JobResponse(BaseModel):
    id: int
    company_id: int
    title: str
    description: str
    location: str | None
    employment_type: str
    experience_level: str | None
    salary_min: int | None
    salary_max: int | None
    skills: str | None
    application_deadline: datetime | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )