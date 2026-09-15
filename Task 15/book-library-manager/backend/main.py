from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from sqlalchemy.orm import Session
import os

from dependencies import (
    get_current_user,
    get_current_admin,
    get_optional_current_user
)

import crud
import models
from models import User
from auth import hash_password, verify_password, create_access_token

from database import engine, get_db
from schemas import (
    BookCreate,
    BookResponse,
    RatingCreate,
    RatingResponse,
    FavoriteResponse,
    UserCreate,
    UserResponse,
    TokenResponse,
    LoginRequest,
    PersonalLibraryResponse
)


models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookNest API")


frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

origins = list(set([
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]))


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
        content={
            "detail": "Database connection failed. Please make sure PostgreSQL is running."
        },
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_error_handler(_, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Server error. Please try again later."
        },
    )


@app.get("/")
def root():
    return {
        "message": "BookNest API is running"
    }


# ============================================================
# AUTHENTICATION
# ============================================================

@app.post(
    "/auth/register",
    response_model=UserResponse
)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db)
):
    existing_email = crud.get_user_by_email(
        db,
        user_data.email
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    existing_username = crud.get_user_by_username(
        db,
        user_data.username
    )

    if existing_username:
        raise HTTPException(
            status_code=400,
            detail="Username already taken"
        )

    password_hash = hash_password(
        user_data.password
    )

    user = crud.create_user(
        db,
        user_data.username,
        user_data.email,
        password_hash
    )

    return user


@app.post(
    "/auth/login",
    response_model=TokenResponse
)
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(
        db,
        login_data.email
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = create_access_token(
        user.id,
        user.role
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user
    }


@app.get(
    "/auth/me",
    response_model=UserResponse
)
def get_me(
    current_user: User = Depends(get_current_user)
):
    return current_user


# ============================================================
# BOOKS
# ============================================================

@app.get(
    "/books",
    response_model=list[BookResponse]
)
def get_books(
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    return crud.get_books(
        db,
        user_id
    )


@app.get(
    "/books/{book_id}",
    response_model=BookResponse
)
def get_single_book(
    book_id: int,
    current_user: User | None = Depends(
        get_optional_current_user
    ),
    db: Session = Depends(get_db)
):
    user_id = current_user.id if current_user else None

    book = crud.get_book(
        db,
        book_id,
        user_id
    )

    if not book:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return book


@app.post(
    "/books",
    response_model=BookResponse
)
def create_book(
    book: BookCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    return crud.create_book(
        db,
        book
    )


@app.put(
    "/books/{book_id}",
    response_model=BookResponse
)
def update_book(
    book_id: int,
    book: BookCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
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
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
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


# ============================================================
# FAVORITES
# ============================================================

@app.get(
    "/favorites",
    response_model=list[BookResponse]
)
def get_favorites(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_favorites(
        db,
        current_user.id
    )


@app.get(
    "/favorites/ids",
    response_model=list[int]
)
def get_favorite_ids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_favorite_ids(
        db,
        current_user.id
    )


@app.post(
    "/favorites/{book_id}",
    response_model=FavoriteResponse
)
def add_favorite(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = crud.add_favorite(
        db,
        current_user.id,
        book_id
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return {
        "book_id": book_id,
        "is_favorite": True,
        "message": "Book added to favorites"
    }


@app.delete(
    "/favorites/{book_id}",
    response_model=FavoriteResponse
)
def remove_favorite(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    crud.remove_favorite(
        db,
        current_user.id,
        book_id
    )

    return {
        "book_id": book_id,
        "is_favorite": False,
        "message": "Book removed from favorites"
    }


# ============================================================
# RATINGS
# ============================================================

@app.post(
    "/books/{book_id}/rating",
    response_model=RatingResponse
)
def rate_book(
    book_id: int,
    rating_data: RatingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    result = crud.rate_book(
        db,
        current_user.id,
        book_id,
        rating_data.rating
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Book not found"
        )

    return result


@app.get(
    "/ratings",
    response_model=list[BookResponse]
)
def get_books_by_rating(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return crud.get_books_by_rating(
        db,
        current_user.id
    )


# ============================================================
# NEW RELEASES
# ============================================================

@app.get(
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

    return crud.get_new_releases(
        db,
        user_id
    )


# ============================================================
# TEMPORARY ADMIN SETUP
# ============================================================

@app.put(
    "/auth/make-admin/{user_id}",
    response_model=UserResponse
)
def make_admin(
    user_id: int,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.role = "admin"

    db.commit()
    db.refresh(user)

    return user


# ============================================================
# PERSONAL LIBRARY
# ============================================================

@app.get(
    "/my-library",
    response_model=list[PersonalLibraryResponse]
)
def get_my_library(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    items = crud.get_user_library(
        db,
        current_user.id
    )

    for item in items:
        item.book = crud.get_book(
            db,
            item.book_id,
            current_user.id
        )

    return items


@app.post(
    "/my-library/{book_id}",
    response_model=PersonalLibraryResponse
)
def add_book_to_library(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud.add_to_user_library(
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

    item.book = crud.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@app.put(
    "/my-library/{book_id}/borrow",
    response_model=PersonalLibraryResponse
)
def borrow_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud.borrow_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@app.put(
    "/my-library/{book_id}/download",
    response_model=PersonalLibraryResponse
)
def download_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud.download_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud.get_book(
        db,
        book_id,
        current_user.id
    )

    return item


@app.put(
    "/my-library/{book_id}/return",
    response_model=PersonalLibraryResponse
)
def return_my_book(
    book_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    item, error = crud.return_book(
        db,
        current_user.id,
        book_id
    )

    if error:
        raise HTTPException(
            status_code=404,
            detail=error
        )

    item.book = crud.get_book(
        db,
        book_id,
        current_user.id
    )

    return item