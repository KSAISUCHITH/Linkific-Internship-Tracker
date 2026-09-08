from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models
import schemas
from database import get_db

router = APIRouter(
    tags=["Foods"]
)


@router.get("/foods", response_model=List[schemas.FoodResponse])
def get_all_foods(db: Session = Depends(get_db)):
    foods = db.query(models.Food).all()
    return foods


@router.get("/foods/{food_id}", response_model=schemas.FoodResponse)
def get_food(food_id: int, db: Session = Depends(get_db)):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with id {food_id} not found"
        )
    return food


@router.post("/foods", response_model=schemas.FoodResponse, status_code=status.HTTP_201_CREATED)
def create_food(food_in: schemas.FoodCreate, db: Session = Depends(get_db)):
    new_food = models.Food(
        name=food_in.name,
        category=food_in.category,
        price=food_in.price
    )
    db.add(new_food)
    db.commit()
    db.refresh(new_food)
    return new_food


@router.put("/foods/{food_id}", response_model=schemas.FoodResponse)
def update_food(food_id: int, food_in: schemas.FoodUpdate, db: Session = Depends(get_db)):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with id {food_id} not found"
        )

    food.name = food_in.name
    food.category = food_in.category
    food.price = food_in.price

    db.commit()
    db.refresh(food)
    return food


@router.delete("/foods/{food_id}")
def delete_food(food_id: int, db: Session = Depends(get_db)):
    food = db.query(models.Food).filter(models.Food.id == food_id).first()
    if not food:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Food item with id {food_id} not found"
        )

    db.delete(food)
    db.commit()
    return {"message": f"Food item with id {food_id} deleted successfully"}
