from sqlalchemy.orm import Session

from app.models.book import Book
from app.models.rating import Rating


def rate_book(
    db: Session,
    user_id: int,
    book_id: int,
    rating_val: int
) -> dict | None:
    book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    if not book:
        return None

    existing = (
        db.query(Rating)
        .filter(
            Rating.user_id == user_id,
            Rating.book_id == book_id
        )
        .first()
    )

    if existing:
        existing.rating = rating_val
    else:
        new_rating = Rating(
            user_id=user_id,
            book_id=book_id,
            rating=rating_val
        )
        db.add(new_rating)

    db.commit()

    ratings = (
        db.query(Rating)
        .filter(Rating.book_id == book_id)
        .all()
    )

    count = len(ratings)
    average = round(
        sum(r.rating for r in ratings) / count,
        1
    )

    return {
        "book_id": book_id,
        "rating": rating_val,
        "average_rating": average,
        "rating_count": count
    }
