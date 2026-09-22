from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.favorite import Favorite
from app.crud.books import enrich_books


def get_favorites(
    db: Session,
    user_id: int
) -> list[Book]:
    favs = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .all()
    )

    book_ids = [f.book_id for f in favs]

    if not book_ids:
        return []

    books = (
        db.query(Book)
        .filter(Book.id.in_(book_ids))
        .all()
    )

    book_map = {
        book.id: book
        for book in books
    }

    ordered_books = [
        book_map[book_id]
        for book_id in book_ids
        if book_id in book_map
    ]

    return enrich_books(
        db,
        ordered_books,
        user_id
    )


def get_favorite_ids(
    db: Session,
    user_id: int
) -> list[int]:
    favs = (
        db.query(Favorite.book_id)
        .filter(Favorite.user_id == user_id)
        .all()
    )

    return [f[0] for f in favs]


def add_favorite(
    db: Session,
    user_id: int,
    book_id: int
) -> bool | None:
    book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not book:
        return None

    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.book_id == book_id
        )
        .first()
    )

    if not existing:
        favorite = Favorite(
            user_id=user_id,
            book_id=book_id
        )
        db.add(favorite)
        db.commit()

    return True


def remove_favorite(
    db: Session,
    user_id: int,
    book_id: int
) -> bool:
    existing = (
        db.query(Favorite)
        .filter(
            Favorite.user_id == user_id,
            Favorite.book_id == book_id
        )
        .first()
    )

    if existing:
        db.delete(existing)
        db.commit()
        return True

    return False
