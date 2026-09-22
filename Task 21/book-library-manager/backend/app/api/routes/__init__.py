from app.api.routes.auth import router as auth_router
from app.api.routes.books import router as books_router
from app.api.routes.favorites import router as favorites_router
from app.api.routes.ratings import router as ratings_router
from app.api.routes.library import router as library_router

__all__ = [
    "auth_router",
    "books_router",
    "favorites_router",
    "ratings_router",
    "library_router",
]
