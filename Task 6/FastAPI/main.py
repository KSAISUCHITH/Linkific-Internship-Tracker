from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
from schemas import UserCreate, UserUpdate, UserPatch

app = FastAPI()

Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "FastAPI is working!"}


@app.post("/users")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    new_user = models.User(
        name=user.name,
        age=user.age,
        email=user.email
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/users")
def get_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return users


@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@app.put("/users/{user_id}")
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.name = user_data.name
    user.age = user_data.age
    user.email = user_data.email

    db.commit()
    db.refresh(user)

    return user


@app.patch("/users/{user_id}")
def patch_user(
    user_id: int,
    user_data: UserPatch,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user_data.name is not None:
        user.name = user_data.name

    if user_data.age is not None:
        user.age = user_data.age

    if user_data.email is not None:
        user.email = user_data.email

    db.commit()
    db.refresh(user)

    return user


@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}