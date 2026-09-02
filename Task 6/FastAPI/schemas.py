from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    age: int
    email: str

class UserUpdate(BaseModel):
    name: str
    age: int
    email: str

class UserPatch(BaseModel):
    name: str | None = None
    age: int | None = None
    email: str | None = None