from sqlalchemy.orm import Session

from app.models.application import Application
from app.models.application_status import ApplicationStatusHistory


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
        status="applied",
    )

    db.add(application)
    db.flush()

    history = ApplicationStatusHistory(
        application_id=application.id,
        status="applied",
        note="Application submitted",
    )

    db.add(history)

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


def get_applications_by_candidate(
    db: Session,
    candidate_id: int,
):
    return (
        db.query(Application)
        .filter(
            Application.candidate_id == candidate_id
        )
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_applications_by_job(
    db: Session,
    job_id: int,
):
    return (
        db.query(Application)
        .filter(Application.job_id == job_id)
        .order_by(Application.applied_at.desc())
        .all()
    )


def get_status_history(
    db: Session,
    application_id: int,
):
    return (
        db.query(ApplicationStatusHistory)
        .filter(
            ApplicationStatusHistory.application_id
            == application_id
        )
        .order_by(
            ApplicationStatusHistory.changed_at.desc()
        )
        .all()
    )


def update_application(
    db: Session,
    application: Application,
    data: dict,
):
    old_status = application.status

    new_status = data.get(
        "status",
        old_status,
    )

    for field, value in data.items():
        setattr(
            application,
            field,
            value,
        )

    if new_status != old_status:
        history = ApplicationStatusHistory(
            application_id=application.id,
            status=new_status,
            note=(
                f"Application status changed "
                f"from {old_status} to {new_status}"
            ),
        )

        db.add(history)

    db.commit()
    db.refresh(application)

    return application


def delete_application(
    db: Session,
    application: Application,
):
    db.delete(application)
    db.commit()