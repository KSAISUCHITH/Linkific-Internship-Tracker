from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.book import BookResponse
from app.schemas.favorite import FavoriteResponse
from app.crud import favorites as crud_favorites

router = APIRouter(prefix="/favorites", tags=["Favorites"])


@router.get(
    "",
    response_model=list[BookResponse]
)
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud_favorites.get_favorites(
        db,
        current_user.id
    )


@router.get(
    "/ids",
    response_model=list[int]
)
def get_favorite_ids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud_favorites.get_favorite_ids(
        db,
        current_user.id
    )


@router.post(
    "/{book_id}",
    response_model=FavoriteResponse
)
def add_favorite(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = crud_favorites.add_favorite(
        db,
        current_user.id,
        book_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return {
        "book_id": book_id,
        "is_favorite": True,
        "message": "Book added to favorites"
    }


@router.delete(
    "/{book_id}",
    response_model=FavoriteResponse
)
def remove_favorite(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crud_favorites.remove_favorite(
        db,
        current_user.id,
        book_id
    )

    return {
        "book_id": book_id,
        "is_favorite": False,
        "message": "Book removed from favorites"
    }
