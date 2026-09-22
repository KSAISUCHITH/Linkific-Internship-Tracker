from pydantic import BaseModel

from app.schemas.book import BookResponse


class PersonalLibraryResponse(BaseModel):
    id: int
    book_id: int
    added_at: str
    borrowed_at: str | None = None
    downloaded_at: str | None = None
    returned_at: str | None = None
    status: str
    book: BookResponse | None = None

    class Config:
        from_attributes = True
