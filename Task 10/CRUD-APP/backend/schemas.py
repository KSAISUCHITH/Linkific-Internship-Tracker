from pydantic import BaseModel, ConfigDict, Field, field_validator


class FoodBase(BaseModel):
    name: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    price: float = Field(..., gt=0)

    @field_validator("name", "category")
    @classmethod
    def not_empty_or_whitespace(cls, value: str) -> str:
        trimmed = value.strip()
        if not trimmed:
            raise ValueError("Field cannot be empty or only whitespace")
        return trimmed


class FoodCreate(FoodBase):
    pass


class FoodUpdate(FoodBase):
    pass


class FoodResponse(FoodBase):
    id: int

    model_config = ConfigDict(from_attributes=True)
