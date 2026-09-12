from collections import defaultdict
from sqlalchemy.orm import Session
from datetime import datetime

from models import User, Book, Favorite, Rating, UserLibrary
from schemas import BookCreate


def get_user_library(db: Session, user_id: int):
    return (
        db.query(UserLibrary)
        .filter(UserLibrary.user_id == user_id)
        .all()
    )


def add_to_user_library(
    db: Session,
    user_id: int,
    book_id: int
):
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
):
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
):
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
):
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


def enrich_books(
    db: Session,
    books: list[Book],
    user_id: int | None = None
):
    if not books:
        return []

    if user_id is not None:
        fav_ids = {
            f[0]
            for f in db.query(Favorite.book_id)
            .filter(Favorite.user_id == user_id)
            .all()
        }
    else:
        fav_ids = set()

    all_ratings = db.query(Rating).all()

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
    book: Book,
    user_id: int | None = None
):
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

        book.user_rating = (
            user_rating.rating
            if user_rating
            else None
        )
    else:
        book.user_rating = None

    return book


def get_books(
    db: Session,
    user_id: int | None = None
):
    books = db.query(Book).all()

    return enrich_books(
        db,
        books,
        user_id
    )


def get_book(
    db: Session,
    book_id: int,
    user_id: int | None = None
):
    book = (
        db.query(Book)
        .filter(Book.id == book_id)
        .first()
    )

    return enrich_book(
        db,
        book,
        user_id
    )


def create_book(
    db: Session,
    book: BookCreate
):
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
):
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


def get_favorites(
    db: Session,
    user_id: int
):
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
):
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
):
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
):
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


def rate_book(
    db: Session,
    user_id: int,
    book_id: int,
    rating_val: int
):
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


def get_books_by_rating(
    db: Session,
    user_id: int | None = None
):
    books = db.query(Book).all()

    enriched = enrich_books(
        db,
        books,
        user_id
    )

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
):
    books = (
        db.query(Book)
        .order_by(
            Book.year.desc(),
            Book.id.desc()
        )
        .all()
    )

    return enrich_books(
        db,
        books,
        user_id
    )


def get_user_by_email(
    db: Session,
    email: str
):
    return (
        db.query(User)
        .filter(User.email == email)
        .first()
    )


def get_user_by_username(
    db: Session,
    username: str
):
    return (
        db.query(User)
        .filter(User.username == username)
        .first()
    )


def create_user(
    db: Session,
    username: str,
    email: str,
    password_hash: str
):
    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        role="user"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user