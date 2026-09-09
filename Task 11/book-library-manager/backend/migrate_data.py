import os
import sqlite3
from sqlalchemy import text
from database import engine, SessionLocal
import models

SQLITE_DB_PATH = os.path.join(os.path.dirname(__file__), "books.db")


def migrate():
    print(f"Connecting to SQLite: {SQLITE_DB_PATH}")
    if not os.path.exists(SQLITE_DB_PATH):
        print(f"SQLite database file not found at {SQLITE_DB_PATH}")
        return

    sqlite_conn = sqlite3.connect(SQLITE_DB_PATH)
    sqlite_cur = sqlite_conn.cursor()

    print("Creating tables in PostgreSQL if not present...")
    models.Base.metadata.create_all(bind=engine)

    pg_db = SessionLocal()

    try:
        sqlite_cur.execute("SELECT id, title, author, genre, year, image, description FROM books ORDER BY id")
        sqlite_books = sqlite_cur.fetchall()
        print(f"Found {len(sqlite_books)} books in SQLite.")

        for b in sqlite_books:
            book_id, title, author, genre, year, image, description = b
            existing = pg_db.query(models.Book).filter(models.Book.id == book_id).first()
            if not existing:
                book = models.Book(
                    id=book_id,
                    title=title,
                    author=author,
                    genre=genre,
                    year=year,
                    image=image,
                    description=description
                )
                pg_db.add(book)
        pg_db.commit()

        sqlite_cur.execute("SELECT id, book_id FROM favorites ORDER BY id")
        sqlite_favs = sqlite_cur.fetchall()
        print(f"Found {len(sqlite_favs)} favorites in SQLite.")

        for f in sqlite_favs:
            fav_id, book_id = f
            existing = pg_db.query(models.Favorite).filter(models.Favorite.id == fav_id).first()
            if not existing:
                fav = models.Favorite(
                    id=fav_id,
                    book_id=book_id
                )
                pg_db.add(fav)
        pg_db.commit()

        sqlite_cur.execute("SELECT id, book_id, rating FROM ratings ORDER BY id")
        sqlite_ratings = sqlite_cur.fetchall()
        print(f"Found {len(sqlite_ratings)} ratings in SQLite.")

        for r in sqlite_ratings:
            rat_id, book_id, rating_val = r
            existing = pg_db.query(models.Rating).filter(models.Rating.id == rat_id).first()
            if not existing:
                rating = models.Rating(
                    id=rat_id,
                    book_id=book_id,
                    rating=rating_val
                )
                pg_db.add(rating)
        pg_db.commit()

        print("Synchronizing PostgreSQL sequences...")
        with engine.begin() as conn:
            conn.execute(text("SELECT setval('books_id_seq', COALESCE((SELECT MAX(id) FROM books), 1));"))
            conn.execute(text("SELECT setval('favorites_id_seq', COALESCE((SELECT MAX(id) FROM favorites), 1));"))
            conn.execute(text("SELECT setval('ratings_id_seq', COALESCE((SELECT MAX(id) FROM ratings), 1));"))

        total_books = pg_db.query(models.Book).count()
        total_favs = pg_db.query(models.Favorite).count()
        total_rats = pg_db.query(models.Rating).count()

        print("--- Migration Verification ---")
        print(f"PostgreSQL books count: {total_books}")
        print(f"PostgreSQL favorites count: {total_favs}")
        print(f"PostgreSQL ratings count: {total_rats}")
        print("Data migration completed successfully!")

    except Exception as e:
        pg_db.rollback()
        print(f"Error during migration: {e}")
        raise
    finally:
        sqlite_conn.close()
        pg_db.close()


if __name__ == "__main__":
    migrate()
