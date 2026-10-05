from sqlalchemy.orm import Session

from app.models.interview import Interview
from app.models.notification import Notification


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
    db.flush()

    if interview.application and interview.application.candidate:
        candidate_user_id = (
            interview.application.candidate.user_id
        )

        notification = Notification(
            user_id=candidate_user_id,
            title="Interview scheduled",
            message=(
                f"A {interview.interview_type} interview has been "
                f"scheduled for {interview.scheduled_at.isoformat()}."
            ),
        )

        db.add(notification)

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
        .order_by(Interview.scheduled_at.asc())
        .all()
    )


def update_interview(
    db: Session,
    interview: Interview,
    data: dict,
):
    for field, value in data.items():
        setattr(interview, field, value)

    db.flush()

    if interview.application and interview.application.candidate:
        candidate_user_id = (
            interview.application.candidate.user_id
        )

        notification = Notification(
            user_id=candidate_user_id,
            title="Interview updated",
            message=(
                f"Your {interview.interview_type} interview "
                f"has been updated."
            ),
        )

        db.add(notification)

    db.commit()
    db.refresh(interview)

    return interview


def delete_interview(
    db: Session,
    interview: Interview,
):
    if interview.application and interview.application.candidate:
        candidate_user_id = (
            interview.application.candidate.user_id
        )

        notification = Notification(
            user_id=candidate_user_id,
            title="Interview cancelled",
            message=(
                f"Your {interview.interview_type} interview "
                f"has been cancelled."
            ),
        )

        db.add(notification)

    db.delete(interview)
    db.commit()