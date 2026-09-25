from pydantic import BaseModel, ConfigDict, Field


class CandidateProfileCreate(BaseModel):
    headline: str | None = Field(
        default=None,
        max_length=150,
    )

    bio: str | None = None

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    skills: str | None = None

    resume_url: str | None = Field(
        default=None,
        max_length=500,
    )


class CandidateProfileUpdate(BaseModel):
    headline: str | None = Field(
        default=None,
        max_length=150,
    )

    bio: str | None = None

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    skills: str | None = None

    resume_url: str | None = Field(
        default=None,
        max_length=500,
    )


class CandidateProfileResponse(BaseModel):
    id: int
    user_id: int
    headline: str | None
    bio: str | None
    location: str | None
    skills: str | None
    resume_url: str | None

    model_config = ConfigDict(
        from_attributes=True,
    )