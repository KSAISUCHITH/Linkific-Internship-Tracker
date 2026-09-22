from pydantic import BaseModel, Field, field_validator


class BookBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    author: str = Field(..., min_length=1, max_length=150)
    genre: str = Field(..., min_length=1, max_length=100)
    year: int = Field(..., ge=1000, le=2100)
    image: str | None = None
    description: str | None = Field(default=None, max_length=5000)

    @field_validator("title", "author", "genre")
    @classmethod
    def validate_text_fields(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("This field is required and cannot be empty.")
        return value

    @field_validator("description")
    @classmethod
    def validate_description(cls, value: str | None):
        if value is None:
            return None

        value = value.strip()
        return value or None


class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: int
    rating: float | None = None
    user_rating: int | None = None
    rating_count: int = 0
    is_favorite: bool = False

    class Config:
        from_attributes = True
