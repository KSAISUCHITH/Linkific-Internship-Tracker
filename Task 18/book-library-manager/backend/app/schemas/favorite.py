from pydantic import BaseModel


class FavoriteResponse(BaseModel):
    book_id: int
    is_favorite: bool
    message: str = ""
