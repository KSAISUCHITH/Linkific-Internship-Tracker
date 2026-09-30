from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.crud.applications import get_application
from app.crud.interviews import (
    create_interview,
    delete_interview,
    get_interview,
    get_interviews_by_application,
    update_interview,
)
from app.database.connection import get_db
from app.schemas.interview import (
    InterviewCreate,
    InterviewResponse,
    InterviewUpdate,
)


router = APIRouter(
    prefix="/interviews",
    tags=["Interviews"],
)


def verify_application_access(
    application,
    current_user,
):
    if current_user.role == "candidate":
        if (
            not application.candidate
            or application.candidate.user_id != current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot access interviews for this application.",
            )
        return

    if current_user.role == "recruiter":
        if (
            not application.job
            or not application.job.company
            or application.job.company.user_id != current_user.id
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot access interviews for this application.",
            )
        return

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access interview data.",
    )


def verify_recruiter_access(
    application,
    current_user,
):
    if current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only recruiters can manage interviews.",
        )

    if (
        not application.job
        or not application.job.company
        or application.job.company.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot manage interviews for this application.",
        )


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application_interview(
    request: InterviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
):
    application = get_application(
        db,
        request.application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    verify_recruiter_access(
        application,
        current_user,
    )

    scheduled_at = request.scheduled_at

    if scheduled_at.tzinfo is None:
        scheduled_at = scheduled_at.replace(
            tzinfo=timezone.utc
        )

    current_time = datetime.now(timezone.utc)

    if scheduled_at <= current_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview date and time must be in the future.",
        )

    return create_interview(
        db=db,
        application_id=request.application_id,
        interview_type=request.interview_type.strip(),
        scheduled_at=scheduled_at,
        duration_minutes=request.duration_minutes,
        meeting_link=(
            request.meeting_link.strip()
            if request.meeting_link
            else None
        ),
        notes=(
            request.notes.strip()
            if request.notes
            else None
        ),
    )


@router.get(
    "/application/{application_id}",
    response_model=list[InterviewResponse],
)
def get_application_interviews(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    application = get_application(
        db,
        application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found",
        )

    verify_application_access(
        application,
        current_user,
    )

    return get_interviews_by_application(
        db,
        application_id,
    )


@router.get(
    "/{interview_id}",
    response_model=InterviewResponse,
)
def get_interview_details(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    interview = get_interview(
        db,
        interview_id,
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    if not interview.application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated application not found",
        )

    verify_application_access(
        interview.application,
        current_user,
    )

    return interview


@router.put(
    "/{interview_id}",
    response_model=InterviewResponse,
)
def update_application_interview(
    interview_id: int,
    request: InterviewUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
):
    interview = get_interview(
        db,
        interview_id,
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    if not interview.application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated application not found",
        )

    verify_recruiter_access(
        interview.application,
        current_user,
    )

    data = request.model_dump(
        exclude_unset=True,
    )

    if "scheduled_at" in data:
        scheduled_at = data["scheduled_at"]

        if scheduled_at.tzinfo is None:
            scheduled_at = scheduled_at.replace(
                tzinfo=timezone.utc
            )

        if scheduled_at <= datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Interview date and time must be in the future.",
            )

        data["scheduled_at"] = scheduled_at

    if "interview_type" in data and data["interview_type"]:
        data["interview_type"] = data["interview_type"].strip()

    if "meeting_link" in data and data["meeting_link"]:
        data["meeting_link"] = data["meeting_link"].strip()

    if "notes" in data and data["notes"]:
        data["notes"] = data["notes"].strip()

    return update_interview(
        db,
        interview,
        data,
    )


@router.delete(
    "/{interview_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application_interview(
    interview_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
):
    interview = get_interview(
        db,
        interview_id,
    )

    if not interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found",
        )

    if not interview.application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Associated application not found",
        )

    verify_recruiter_access(
        interview.application,
        current_user,
    )

    delete_interview(
        db,
        interview,
    )