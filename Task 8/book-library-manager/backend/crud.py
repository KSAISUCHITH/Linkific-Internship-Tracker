from sqlalchemy.orm import Session

from models import Book
from schemas import BookCreate


def get_books(db: Session):
    return db.query(Book).all()


def get_book(db: Session, book_id: int):
    return db.query(Book).filter(Book.id == book_id).first()


def create_book(db: Session, book: BookCreate):
    new_book = Book(
        title=book.title,
        author=book.author,
        genre=book.genre,
        year=book.year,
        image=book.image
    )

    db.add(new_book)
    db.commit()
    db.refresh(new_book)

    return new_book


def update_book(
    db: Session,
    book_id: int,
    book: BookCreate
):
    existing_book = get_book(db, book_id)

    if not existing_book:
        return None

    existing_book.title = book.title
    existing_book.author = book.author
    existing_book.genre = book.genre
    existing_book.year = book.year
    existing_book.image = book.image

    db.commit()
    db.refresh(existing_book)

    return existing_book


def delete_book(db: Session, book_id: int):
    existing_book = get_book(db, book_id)

    if not existing_book:
        return None

    db.delete(existing_book)
    db.commit()

    return existing_book