from pydantic import BaseModel, Field


class RatingCreate(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating between 1 and 5")


class RatingResponse(BaseModel):
    book_id: int
    rating: int
    average_rating: float
    rating_count: int
