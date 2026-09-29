from sqlalchemy.orm import Session

from app.models.interview import Interview


def create_interview(
    db: Session,
    application_id: int,
    interview_type: str,
    scheduled_at,
    duration_minutes: int | None,
    meeting_link: str | None,
    notes: str | None,
):
    interview = Interview(
        application_id=application_id,
        interview_type=interview_type,
        scheduled_at=scheduled_at,
        duration_minutes=duration_minutes,
        meeting_link=meeting_link,
        notes=notes,
    )

    db.add(interview)
    db.commit()
    db.refresh(interview)

    return interview


def get_interview(
    db: Session,
    interview_id: int,
):
    return (
        db.query(Interview)
        .filter(Interview.id == interview_id)
        .first()
    )


def get_interviews(
    db: Session,
):
    return db.query(Interview).all()


def get_interviews_by_application(
    db: Session,
    application_id: int,
):
    return (
        db.query(Interview)
        .filter(
            Interview.application_id == application_id
        )
        .all()
    )


def update_interview(
    db: Session,
    interview: Interview,
    data: dict,
):
    for field, value in data.items():
        setattr(interview, field, value)

    db.commit()
    db.refresh(interview)

    return interview


def delete_interview(
    db: Session,
    interview: Interview,
):
    db.delete(interview)
    db.commit()