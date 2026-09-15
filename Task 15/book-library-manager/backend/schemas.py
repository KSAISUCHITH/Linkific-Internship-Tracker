from pydantic import BaseModel, Field


class BookBase(BaseModel):
    title: str
    author: str
    genre: str
    year: int
    image: str | None = None
    description: str | None = None


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
    password: str = Field(..., min_length=6)


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
    email: str
    password: str





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