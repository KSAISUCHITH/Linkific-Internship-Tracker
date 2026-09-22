from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_admin, get_optional_current_user
from app.database.connection import get_db
from app.models.user import User
from app.schemas.book import BookCreate, BookResponse
from app.crud import books as crud_books

router = APIRouter(prefix="/books", tags=["Books"])


@router.get(
    "",
    response_model=list[BookResponse]
)
def get_books(
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return crud_books.get_books(
        db,
        user_id
    )


@router.get(
    "/{book_id}",
    response_model=BookResponse
)
def get_single_book(
    book_id: int,
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    book = crud_books.get_book(
        db,
        book_id,
        user_id
    )

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book


@router.post(
    "",
    response_model=BookResponse,
    status_code=status.HTTP_200_OK
)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return crud_books.create_book(
        db,
        book
    )


@router.put(
    "/{book_id}",
    response_model=BookResponse
)
def update_book(
    book_id: int,
    book: BookCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    updated_book = crud_books.update_book(
        db,
        book_id,
        book
    )

    if not updated_book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return updated_book


@router.delete(
    "/{book_id}"
)
def delete_book(
    book_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    deleted_book = crud_books.delete_book(
        db,
        book_id
    )

    if not deleted_book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return {
        "message": "Book deleted successfully"
    }
