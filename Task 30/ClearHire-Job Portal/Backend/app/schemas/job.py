from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, model_validator


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

    @model_validator(mode="after")
    def validate_salary_range(self):
        if (
            self.salary_min is not None
            and self.salary_max is not None
            and self.salary_min > self.salary_max
        ):
            raise ValueError(
                "Minimum salary cannot exceed maximum salary"
            )

        return self


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

    @model_validator(mode="after")
    def validate_salary_range(self):
        if (
            self.salary_min is not None
            and self.salary_max is not None
            and self.salary_min > self.salary_max
        ):
            raise ValueError(
                "Minimum salary cannot exceed maximum salary"
            )

        return self


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