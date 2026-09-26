from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
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


@router.post(
    "",
    response_model=InterviewResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_application_interview(
    request: InterviewCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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

    return create_interview(
        db=db,
        application_id=request.application_id,
        interview_type=request.interview_type,
        scheduled_at=request.scheduled_at,
        duration_minutes=request.duration_minutes,
        meeting_link=request.meeting_link,
        notes=request.notes,
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

    return interview


@router.put(
    "/{interview_id}",
    response_model=InterviewResponse,
)
def update_application_interview(
    interview_id: int,
    request: InterviewUpdate,
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

    data = request.model_dump(
        exclude_unset=True,
    )

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

    delete_interview(
        db,
        interview,
    )