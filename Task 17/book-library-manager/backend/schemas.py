from pydantic import BaseModel, Field, field_validator
import re


EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


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


class RatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5")


class RatingResponse(BaseModel):
    book_id: int
    rating: int
    average_rating: float
    rating_count: int


class FavoriteResponse(BaseModel):
    book_id: int
    is_favorite: bool
    message: str = ""


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=128)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("Username is required.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip()
        if not EMAIL_PATTERN.fullmatch(value):
            raise ValueError("Please enter a valid email address.")
        return value


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip()
        if not EMAIL_PATTERN.fullmatch(value):
            raise ValueError("Please enter a valid email address.")
        return value


class PersonalLibraryResponse(BaseModel):
    id: int
    book_id: int
    added_at: str
    borrowed_at: str | None = None
    downloaded_at: str | None = None
    returned_at: str | None = None
    status: str
    book: BookResponse | None = None

    class Config:
        from_attributes = True
