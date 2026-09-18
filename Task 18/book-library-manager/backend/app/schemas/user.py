import re
from pydantic import BaseModel, Field, field_validator

EMAIL_PATTERN = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=6, max_length=128)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str):
        value = value.strip()
        if not value:
            raise ValueError("Username is required.")
        return value

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip()
        if not EMAIL_PATTERN.fullmatch(value):
            raise ValueError("Please enter a valid email address.")
        return value


class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str

    class Config:
        from_attributes = True
