from datetime import datetime
from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.user_library import UserLibrary


def get_user_library(
    db: Session,
    user_id: int
) -> list[UserLibrary]:
    return (
        db.query(UserLibrary)
        .filter(UserLibrary.user_id == user_id)
        .all()
    )


def add_to_user_library(
    db: Session,
    user_id: int,
    book_id: int
) -> tuple[UserLibrary | None, str | None]:
    book = db.query(Book).filter(Book.id == book_id).first()

    if not book:
        return None, "Book not found"

    existing = (
        db.query(UserLibrary)
        .filter(
            UserLibrary.user_id == user_id,
            UserLibrary.book_id == book_id
        )
        .first()
    )

    if existing:
        return existing, "Book already in personal library"

    library_item = UserLibrary(
        user_id=user_id,
        book_id=book_id,
        added_at=datetime.now().isoformat(),
        status="in_library"
    )

    db.add(library_item)
    db.commit()
    db.refresh(library_item)

    return library_item, None


def borrow_book(
    db: Session,
    user_id: int,
    book_id: int
) -> tuple[UserLibrary | None, str | None]:
    item = (
        db.query(UserLibrary)
        .filter(
            UserLibrary.user_id == user_id,
            UserLibrary.book_id == book_id
        )
        .first()
    )

    if not item:
        return None, "Book is not in your personal library"

    item.borrowed_at = datetime.now().isoformat()
    item.status = "borrowed"

    db.commit()
    db.refresh(item)

    return item, None


def download_book(
    db: Session,
    user_id: int,
    book_id: int
) -> tuple[UserLibrary | None, str | None]:
    item = (
        db.query(UserLibrary)
        .filter(
            UserLibrary.user_id == user_id,
            UserLibrary.book_id == book_id
        )
        .first()
    )

    if not item:
        return None, "Book is not in your personal library"

    item.downloaded_at = datetime.now().isoformat()
    item.status = "downloaded"

    db.commit()
    db.refresh(item)

    return item, None


def return_book(
    db: Session,
    user_id: int,
    book_id: int
) -> tuple[UserLibrary | None, str | None]:
    item = (
        db.query(UserLibrary)
        .filter(
            UserLibrary.user_id == user_id,
            UserLibrary.book_id == book_id
        )
        .first()
    )

    if not item:
        return None, "Book is not in your personal library"

    item.returned_at = datetime.now().isoformat()
    item.status = "returned"

    db.commit()
    db.refresh(item)

    return item, None
