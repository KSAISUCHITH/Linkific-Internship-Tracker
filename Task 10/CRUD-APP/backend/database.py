from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./food_menu.db"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    import models

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        existing_count = db.query(models.Food).count()
        if existing_count == 0:
            sample_items = [
                models.Food(name="Margherita Pizza", category="Pizza", price=250.0),
                models.Food(name="Veg Burger", category="Burger", price=150.0),
                models.Food(name="Cold Coffee", category="Beverage", price=120.0),
            ]
            db.add_all(sample_items)
            db.commit()
    finally:
        db.close()
