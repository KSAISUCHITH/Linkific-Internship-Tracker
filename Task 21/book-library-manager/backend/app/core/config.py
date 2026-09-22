import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg://postgres:postgres@localhost:5433/book_next_2"
)

FRONTEND_URL = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "booknest-development-secret-key"
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

CORS_ORIGINS = list(set([
    FRONTEND_URL,
    "http://localhost:5173",
    "http://127.0.0.1:5173"
]))
