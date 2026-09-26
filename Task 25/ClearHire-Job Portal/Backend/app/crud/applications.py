from sqlalchemy.orm import Session

from app.models.application import Application


def create_application(
    db: Session,
    candidate_id: int,
    job_id: int,
    expected_response_days: int | None,
):
    application = Application(
        candidate_id=candidate_id,
        job_id=job_id,
        expected_response_days=expected_response_days,
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


def get_application(
    db: Session,
    application_id: int,
):
    return (
        db.query(Application)
        .filter(Application.id == application_id)
        .first()
    )


def get_applications(
    db: Session,
):
    return db.query(Application).all()


def get_applications_by_candidate(
    db: Session,
    candidate_id: int,
):
    return (
        db.query(Application)
        .filter(Application.candidate_id == candidate_id)
        .all()
    )


def get_applications_by_job(
    db: Session,
    job_id: int,
):
    return (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .all()
    )


def update_application(
    db: Session,
    application: Application,
    data: dict,
):
    for field, value in data.items():
        setattr(application, field, value)

    db.commit()
    db.refresh(application)

    return application


def delete_application(
    db: Session,
    application: Application,
):
    db.delete(application)
    db.commit()