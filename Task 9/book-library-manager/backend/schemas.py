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