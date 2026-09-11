from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    author: str
    genre: str
    year: int
    image: str | None = None


class BookCreate(BookBase):
    pass


class BookResponse(BookBase):
    id: int

    class Config:
        from_attributes = True