
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import OperationalError, SQLAlchemyError

from app.core.config import CORS_ORIGINS
from app.database.connection import engine
import app.models
from app.api.routes import (
    auth_router,
    books_router,
    favorites_router,
    ratings_router,
    library_router,
)

app.models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="BookNest API",
    description="Production-ready REST API for BookNest Library Manager",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def request_validation_error_handler(request: Request, exc: RequestValidationError):
    errors = []

    for error in exc.errors():
        location = error.get("loc", [])
        field = str(location[-1]) if location else "request"
        message = error.get("msg", "Invalid value")

        errors.append({
            "field": field,
            "message": message
        })

    return JSONResponse(
        status_code=422,
        content={
            "detail": "Please check the submitted fields.",
            "errors": errors
        }
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


@app.exception_handler(Exception)
async def unexpected_error_handler(_, exc):
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An unexpected server error occurred. Please try again later."
        },
    )


@app.get("/")
def root():
    return {
        "message": "BookNest API is running"
    }


app.include_router(auth_router)
app.include_router(books_router)
app.include_router(favorites_router)
app.include_router(ratings_router)
app.include_router(library_router)
