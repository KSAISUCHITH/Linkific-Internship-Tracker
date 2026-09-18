from collections import defaultdict
from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.favorite import Favorite
from app.models.rating import Rating
from app.schemas.book import BookCreate


def enrich_books(
    db: Session,
    books: list[Book],
    user_id: int | None = None
) -> list[Book]:
    if not books:
        return []

    book_ids = [b.id for b in books]

    if user_id is not None:
        fav_ids = {
            f[0]
            for f in db.query(Favorite.book_id)
            .filter(
                Favorite.user_id == user_id,
                Favorite.book_id.in_(book_ids)
            )
            .all()
        }
    else:
        fav_ids = set()

    all_ratings = (
        db.query(Rating)
        .filter(Rating.book_id.in_(book_ids))
        .all()
    )

    ratings_by_book = defaultdict(list)
    user_ratings = {}

    for r in all_ratings:
        ratings_by_book[r.book_id].append(r.rating)

        if user_id is not None and r.user_id == user_id:
            user_ratings[r.book_id] = r.rating

    for book in books:
        book.is_favorite = book.id in fav_ids

        book_ratings = ratings_by_book.get(book.id, [])

        if book_ratings:
            book.rating_count = len(book_ratings)
            book.rating = round(
                sum(book_ratings) / len(book_ratings),
                1
            )
        else:
            book.rating_count = 0
            book.rating = None

        book.user_rating = user_ratings.get(book.id)

    return books


def enrich_book(
    db: Session,
    book: Book | None,
    user_id: int | None = None
) -> Book | None:
    if not book:
        return None

    if user_id is not None:
        book.is_favorite = (
            db.query(Favorite)
            .filter(
                Favorite.book_id == book.id,
                Favorite.user_id == user_id
            )
            .first()
            is not None
        )
    else:
        book.is_favorite = False

    ratings = (
        db.query(Rating)
        .filter(Rating.book_id == book.id)
        .all()
    )

    if ratings:
        book.rating_count = len(ratings)
        book.rating = round(
            sum(r.rating for r in ratings) / len(ratings),
            1
        )
    else:
        book.rating_count = 0
        book.rating = None

    if user_id is not None:
        user_rating = (
            db.query(Rating)
            .filter(
                Rating.book_id == book.id,
                Rating.user_id == user_id
            )
            .first()
        )

        book.user_rating = user_rating.rating if user_rating else None
    else:
        book.user_rating = None

    return book


def get_books(
    db: Session,
    user_id: int | None = None
) -> list[Book]:
    books = db.query(Book).all()
    return enrich_books(db, books, user_id)


def get_book(
    db: Session,
    book_id: int,
    user_id: int | None = None
) -> Book | None:
    book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )
    return enrich_book(db, book, user_id)


def create_book(
    db: Session,
    book: BookCreate
) -> Book:
    new_book = Book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        year=book.year,
        image=book.image,
        description=book.description
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return enrich_book(db, new_book)


def update_book(
    db: Session,
    book_id: int,
    book: BookCreate
) -> Book | None:
    existing_book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not existing_book:
        return None

    existing_book.title = book.title
    existing_book.author = book.author
    existing_book.genre = book.genre
    existing_book.year = book.year
    existing_book.image = book.image

    if book.description is not None:
        existing_book.description = book.description

    db.commit()
    db.refresh(existing_book)

    return enrich_book(db, existing_book)


def delete_book(
    db: Session,
    book_id: int
) -> Book | None:
    existing_book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not existing_book:
        return None

    db.query(Favorite).filter(
        Favorite.book_id == book_id
    ).delete()

    db.query(Rating).filter(
        Rating.book_id == book_id
    ).delete()

    db.delete(existing_book)
    db.commit()

    return existing_book


def get_books_by_rating(
    db: Session,
    user_id: int | None = None
) -> list[Book]:
    books = db.query(Book).all()
    enriched = enrich_books(db, books, user_id)

    return sorted(
        enriched,
        key=lambda b: (
            b.rating is not None,
            b.rating or 0,
            b.rating_count
        ),
        reverse=True
    )


def get_new_releases(
    db: Session,
    user_id: int | None = None
) -> list[Book]:
    books = (
        db.query(Book)
        .order_by(
            Book.year.desc(),
            Book.id.desc()
        )
        .all()
    )

    return enrich_books(db, books, user_id)
