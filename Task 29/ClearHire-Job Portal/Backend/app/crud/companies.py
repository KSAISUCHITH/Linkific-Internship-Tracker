from sqlalchemy.orm import Session

from app.models.company import Company


def create_company(
    db: Session,
    user_id: int,
    name: str,
    description: str | None,
    website: str | None,
    location: str | None,
    industry: str | None,
):
    company = Company(
        user_id=user_id,
        name=name,
        description=description,
        website=website,
        location=location,
        industry=industry,
    )

    db.add(company)
    db.commit()
    db.refresh(company)

    return company


def get_company(
    db: Session,
    company_id: int,
):
    return (
        db.query(Company)
        .filter(Company.id == company_id)
        .first()
    )


def get_company_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(Company)
        .filter(Company.user_id == user_id)
        .first()
    )


def get_companies(
    db: Session,
):
    return db.query(Company).all()


def update_company(
    db: Session,
    company: Company,
    data: dict,
):
    for field, value in data.items():
        setattr(company, field, value)

    db.commit()
    db.refresh(company)

    return company


def delete_company(
    db: Session,
    company: Company,
):
    db.delete(company)
    db.commit()