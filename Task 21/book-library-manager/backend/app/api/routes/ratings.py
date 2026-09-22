from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.book import BookResponse
from app.schemas.rating import RatingCreate, RatingResponse
from app.crud import ratings as crud_ratings
from app.crud import books as crud_books

router = APIRouter(tags=["Ratings"])


@router.post(
    "/books/{book_id}/rating",
    response_model=RatingResponse
)
def rate_book(
    book_id: int,
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = crud_ratings.rate_book(
        db,
        current_user.id,
        book_id,
        rating_data.rating
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return result


@router.get(
    "/ratings",
    response_model=list[BookResponse]
)
def get_books_by_rating(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud_books.get_books_by_rating(
        db,
        current_user.id
    )
