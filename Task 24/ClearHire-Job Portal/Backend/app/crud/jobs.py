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
):
    return db.query(Job).all()


def get_jobs_by_company(
    db: Session,
    company_id: int,
):
    return (
        db.query(Job)
        .filter(Job.company_id == company_id)
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