from pydantic import BaseModel, ConfigDict, Field


class CompanyCreate(BaseModel):
    name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    description: str | None = None

    website: str | None = Field(
        default=None,
        max_length=255,
    )

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    industry: str | None = Field(
        default=None,
        max_length=100,
    )


class CompanyUpdate(BaseModel):
    name: str | None = Field(
        default=None,
        min_length=2,
        max_length=150,
    )

    description: str | None = None

    website: str | None = Field(
        default=None,
        max_length=255,
    )

    location: str | None = Field(
        default=None,
        max_length=100,
    )

    industry: str | None = Field(
        default=None,
        max_length=100,
    )


class CompanyResponse(BaseModel):
    id: int
    user_id: int
    name: str
    description: str | None
    website: str | None
    location: str | None
    industry: str | None

    model_config = ConfigDict(
        from_attributes=True,
    )