from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import Session
import os

import crud
import models

from database import engine, get_db
from schemas import (
    BookCreate,
    BookResponse,
    RatingCreate,
    RatingResponse,
    FavoriteResponse
)


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookNest API")

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = list(set([frontend_url, "http://localhost:5173", "http://127.0.0.1:5173"]))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(OperationalError)
async def operational_error_handler(_, exc):
    return JSONResponse(
        status_code=503,
        content={"detail": "Database connection failed. Please make sure PostgreSQL is running."},
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(_, exc):
    return JSONResponse(
        status_code=500,
        content={"detail": "Server error. Please try again later."},
    )


@app.get("/")
def root():
    return {
        "message": "BookNest API is running"
    }


@app.get("/books", response_model=list[BookResponse])
def get_books(db: Session = Depends(get_db)):
    return crud.get_books(db)


@app.get("/books/{book_id}", response_model=BookResponse)
def get_single_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    book = crud.get_book(db, book_id)

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book


@app.post("/books", response_model=BookResponse)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db)
):
    return crud.create_book(db, book)


@app.put("/books/{book_id}", response_model=BookResponse)
def update_book(
    book_id: int,
    book: BookCreate,
    db: Session = Depends(get_db)
):
    updated_book = crud.update_book(
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


@app.delete("/books/{book_id}")
def delete_book(
    book_id: int,
    db: Session = Depends(get_db)
):
    deleted_book = crud.delete_book(
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


@app.get("/favorites", response_model=list[BookResponse])
def get_favorites(db: Session = Depends(get_db)):
    return crud.get_favorites(db)


@app.get("/favorites/ids", response_model=list[int])
def get_favorite_ids(db: Session = Depends(get_db)):
    return crud.get_favorite_ids(db)


@app.post("/favorites/{book_id}", response_model=FavoriteResponse)
def add_favorite(
    book_id: int,
    db: Session = Depends(get_db)
):
    result = crud.add_favorite(db, book_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return {
        "book_id": book_id,
        "is_favorite": True,
        "message": "Book added to favorites"
    }


@app.delete("/favorites/{book_id}", response_model=FavoriteResponse)
def remove_favorite(
    book_id: int,
    db: Session = Depends(get_db)
):
    crud.remove_favorite(db, book_id)
    return {
        "book_id": book_id,
        "is_favorite": False,
        "message": "Book removed from favorites"
    }


@app.post("/books/{book_id}/rating", response_model=RatingResponse)
def rate_book(
    book_id: int,
    rating_data: RatingCreate,
    db: Session = Depends(get_db)
):
    result = crud.rate_book(db, book_id, rating_data.rating)
    if result is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return result


@app.get("/ratings", response_model=list[BookResponse])
def get_books_by_rating(db: Session = Depends(get_db)):
    return crud.get_books_by_rating(db)


@app.get("/new-releases", response_model=list[BookResponse])
def get_new_releases(db: Session = Depends(get_db)):
    return crud.get_new_releases(db)
