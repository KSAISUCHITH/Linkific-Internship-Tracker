from collections import defaultdict
from sqlalchemy.orm import Session

from models import Book, Favorite, Rating
from schemas import BookCreate


def enrich_books(db: Session, books: list[Book]):
    if not books:
        return []

    fav_ids = {f[0] for f in db.query(Favorite.book_id).all()}

    all_ratings = db.query(Rating).all()
    ratings_by_book = defaultdict(list)
    for r in all_ratings:
        ratings_by_book[r.book_id].append(r.rating)

    for b in books:
        b.is_favorite = b.id in fav_ids
        book_rats = ratings_by_book.get(b.id, [])
        if book_rats:
            b.rating_count = len(book_rats)
            b.rating = round(sum(book_rats) / len(book_rats), 1)
            b.user_rating = book_rats[-1]
        else:
            b.rating_count = 0
            b.rating = None
            b.user_rating = None

    return books


def enrich_book(db: Session, book: Book):
    if not book:
        return None

    is_fav = db.query(Favorite).filter(Favorite.book_id == book.id).first() is not None
    book.is_favorite = is_fav

    ratings = db.query(Rating).filter(Rating.book_id == book.id).all()
    if ratings:
        book.rating_count = len(ratings)
        book.rating = round(sum(r.rating for r in ratings) / len(ratings), 1)
        book.user_rating = ratings[-1].rating
    else:
        book.rating_count = 0
        book.rating = None
        book.user_rating = None

    return book


def get_books(db: Session):
    books = db.query(Book).all()
    return enrich_books(db, books)


def get_book(db: Session, book_id: int):
    book = db.query(Book).filter(Book.id == book_id).first()
    return enrich_book(db, book)


def create_book(db: Session, book: BookCreate):
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
):
    existing_book = db.query(Book).filter(Book.id == book_id).first()

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


def delete_book(db: Session, book_id: int):
    existing_book = db.query(Book).filter(Book.id == book_id).first()

    if not existing_book:
        return None

    db.query(Favorite).filter(Favorite.book_id == book_id).delete()
    db.query(Rating).filter(Rating.book_id == book_id).delete()

    db.delete(existing_book)
    db.commit()

    return existing_book


def get_favorites(db: Session):
    favs = db.query(Favorite).all()
    book_ids = [f.book_id for f in favs]
    if not book_ids:
        return []
    books = db.query(Book).filter(Book.id.in_(book_ids)).all()
    book_map = {b.id: b for b in books}
    ordered_books = [book_map[bid] for bid in book_ids if bid in book_map]
    return enrich_books(db, ordered_books)


def get_favorite_ids(db: Session):
    favs = db.query(Favorite.book_id).all()
    return [f[0] for f in favs]


def add_favorite(db: Session, book_id: int):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        return None

    existing = db.query(Favorite).filter(Favorite.book_id == book_id).first()
    if not existing:
        fav = Favorite(book_id=book_id)
        db.add(fav)
        db.commit()

    return True


def remove_favorite(db: Session, book_id: int):
    existing = db.query(Favorite).filter(Favorite.book_id == book_id).first()
    if existing:
        db.delete(existing)
        db.commit()
        return True
    return False


def rate_book(db: Session, book_id: int, rating_val: int):
    book = db.query(Book).filter(Book.id == book_id).first()
    if not book:
        return None

    existing = db.query(Rating).filter(Rating.book_id == book_id).first()
    if existing:
        existing.rating = rating_val
    else:
        new_rating = Rating(book_id=book_id, rating=rating_val)
        db.add(new_rating)

    db.commit()

    ratings = db.query(Rating).filter(Rating.book_id == book_id).all()
    count = len(ratings)
    avg = round(sum(r.rating for r in ratings) / count, 1)

    return {
        "book_id": book_id,
        "rating": rating_val,
        "average_rating": avg,
        "rating_count": count
    }


def get_books_by_rating(db: Session):
    books = db.query(Book).all()
    enriched = enrich_books(db, books)
    return sorted(
        enriched,
        key=lambda b: (b.rating is not None, b.rating or 0, b.rating_count),
        reverse=True
    )


def get_new_releases(db: Session):
    books = db.query(Book).order_by(Book.year.desc(), Book.id.desc()).all()
    return enrich_books(db, books)