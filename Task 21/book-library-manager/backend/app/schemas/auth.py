from pydantic import BaseModel, Field, field_validator

from app.schemas.user import EMAIL_PATTERN, UserResponse


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=1, max_length=128)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: str):
        value = value.strip()
        if not EMAIL_PATTERN.fullmatch(value):
            raise ValueError("Please enter a valid email address.")
        return value


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse
