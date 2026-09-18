from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, get_optional_current_user
from app.database.connection import get_db
from app.models.book import Book
from app.models.user import User
from app.schemas.book import BookResponse
from app.schemas.library import PersonalLibraryResponse
from app.crud import books as crud_books
from app.crud import library as crud_library

router = APIRouter(tags=["Personal Library & Releases"])


@router.get(
    "/new-releases",
    response_model=list[BookResponse]
)
def get_new_releases(
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None
    return crud_books.get_new_releases(
        db,
        user_id
    )


@router.get(
    "/my-library",
    response_model=list[PersonalLibraryResponse]
)
def get_my_library(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = crud_library.get_user_library(
        db,
        current_user.id
    )

    if not items:
        return []

    book_ids = [item.book_id for item in items]
    books = (
        db.query(Book)
        .filter(Book.id.in_(book_ids))
        .all()
    )

    enriched_books = crud_books.enrich_books(
        db,
        books,
        current_user.id
    )
    book_map = {b.id: b for b in enriched_books}

    for item in items:
        item.book = book_map.get(item.book_id)

    return items


@router.post(
    "/my-library/{book_id}",
    response_model=PersonalLibraryResponse
)
def add_book_to_library(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud_library.add_to_user_library(
        db,
        current_user.id,
        book_id
    )

    if error:
        error_status = (
            404
            if error == "Book not found"
            else 400
        )

        raise HTTPException(
            status_code=error_status,
            detail=error
        )

    item.book = crud_books.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@router.put(
    "/my-library/{book_id}/borrow",
    response_model=PersonalLibraryResponse
)
def borrow_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud_library.borrow_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud_books.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@router.put(
    "/my-library/{book_id}/download",
    response_model=PersonalLibraryResponse
)
def download_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud_library.download_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud_books.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@router.put(
    "/my-library/{book_id}/return",
    response_model=PersonalLibraryResponse
)
def return_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud_library.return_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud_books.get_book(
        db,
        book_id,
        current_user.id
    )

    return item
