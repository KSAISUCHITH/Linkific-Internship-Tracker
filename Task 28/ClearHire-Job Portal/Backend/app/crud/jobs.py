from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.models.job import Job


def create_job(
    db: Session,
    company_id: int,
    title: str,
    description: str,
    location: str | None,
    employment_type: str,
    experience_level: str | None,
    salary_min: int | None,
    salary_max: int | None,
    skills: str | None,
    application_deadline,
):
    job = Job(
        company_id=company_id,
        title=title,
        description=description,
        location=location,
        employment_type=employment_type,
        experience_level=experience_level,
        salary_min=salary_min,
        salary_max=salary_max,
        skills=skills,
        application_deadline=application_deadline,
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


def get_job(
    db: Session,
    job_id: int,
):
    return (
        db.query(Job)
        .filter(Job.id == job_id)
        .first()
    )


def get_jobs(
    db: Session,
    search: str | None = None,
    location: str | None = None,
    employment_type: str | None = None,
    experience_level: str | None = None,
):
    query = db.query(Job)

    if search:
        search_term = f"%{search.strip()}%"

        query = query.filter(
            or_(
                Job.title.ilike(search_term),
                Job.description.ilike(search_term),
                Job.skills.ilike(search_term),
                Job.location.ilike(search_term),
            )
        )

    if location:
        query = query.filter(
            Job.location.ilike(
                f"%{location.strip()}%"
            )
        )

    if employment_type:
        query = query.filter(
            Job.employment_type.ilike(
                employment_type.strip()
            )
        )

    if experience_level:
        query = query.filter(
            Job.experience_level.ilike(
                experience_level.strip()
            )
        )

    return (
        query
        .order_by(Job.created_at.desc())
        .all()
    )


def get_jobs_by_company(
    db: Session,
    company_id: int,
):
    return (
        db.query(Job)
        .filter(Job.company_id == company_id)
        .order_by(Job.created_at.desc())
        .all()
    )


def update_job(
    db: Session,
    job: Job,
    data: dict,
):
    for field, value in data.items():
        setattr(job, field, value)

    db.commit()
    db.refresh(job)

    return job


def delete_job(
    db: Session,
    job: Job,
):
    db.delete(job)
    db.commit()