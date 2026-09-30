from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.crud.applications import (
    create_application,
    delete_application,
    get_application,
    get_applications_by_candidate,
    get_applications_by_job,
    get_status_history,
    update_application,
)
from app.crud.candidates import get_candidate_profile_by_user
from app.crud.jobs import get_job
from app.database.connection import get_db
from app.schemas.application import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationUpdate,
)

router = APIRouter(
    prefix="/applications",
    tags=["Applications"],
)

ALLOWED_STATUSES = {
    "applied",
    "under_review",
    "shortlisted",
    "interview",
    "rejected",
    "offer",
}


@router.post(
    "",
    response_model=ApplicationResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_new_application(
    request: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found.",
        )

    job = get_job(db, request.job_id)

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    if job.application_deadline:
        current_time = datetime.now(timezone.utc)
        deadline = job.application_deadline

        if deadline.tzinfo is None:
            deadline = deadline.replace(tzinfo=timezone.utc)

        if current_time > deadline:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Application deadline has passed.",
            )

    applications = get_applications_by_candidate(
        db,
        candidate.id,
    )

    if any(
        application.job_id == job.id
        for application in applications
    ):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied for this job.",
        )

    return create_application(
        db=db,
        candidate_id=candidate.id,
        job_id=job.id,
        expected_response_days=request.expected_response_days,
    )


@router.get(
    "/my-applications",
    response_model=list[ApplicationResponse],
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found.",
        )

    return get_applications_by_candidate(
        db,
        candidate.id,
    )


@router.get(
    "/job/{job_id}",
    response_model=list[ApplicationResponse],
)
def get_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
):
    job = get_job(db, job_id)

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found.",
        )

    if (
        not job.company
        or job.company.user_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view these applications.",
        )

    return get_applications_by_job(
        db,
        job_id,
    )


@router.get(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def get_application_details(
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
            detail="Application not found.",
        )

    candidate_access = (
        current_user.role == "candidate"
        and application.candidate
        and application.candidate.user_id == current_user.id
    )

    recruiter_access = (
        current_user.role == "recruiter"
        and application.job
        and application.job.company
        and application.job.company.user_id == current_user.id
    )

    if not candidate_access and not recruiter_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this application.",
        )

    return application


@router.get(
    "/{application_id}/history",
)
def get_application_status_history(
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
            detail="Application not found.",
        )

    candidate_access = (
        current_user.role == "candidate"
        and application.candidate
        and application.candidate.user_id == current_user.id
    )

    recruiter_access = (
        current_user.role == "recruiter"
        and application.job
        and application.job.company
        and application.job.company.user_id == current_user.id
    )

    if not candidate_access and not recruiter_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to view this application history.",
        )

    return get_status_history(
        db,
        application_id,
    )


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_application_details(
    application_id: int,
    request: ApplicationUpdate,
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
            detail="Application not found.",
        )

    candidate_access = (
        current_user.role == "candidate"
        and application.candidate
        and application.candidate.user_id == current_user.id
    )

    recruiter_access = (
        current_user.role == "recruiter"
        and application.job
        and application.job.company
        and application.job.company.user_id == current_user.id
    )

    if not candidate_access and not recruiter_access:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this application.",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    if current_user.role == "candidate":
        if "status" in data:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Candidates cannot change application status.",
            )

    if current_user.role == "recruiter":
        if "status" in data:
            new_status = data["status"].strip().lower()

            if new_status not in ALLOWED_STATUSES:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=(
                        "Invalid application status. "
                        f"Allowed values: {', '.join(sorted(ALLOWED_STATUSES))}."
                    ),
                )

            data["status"] = new_status

    return update_application(
        db,
        application,
        data,
    )


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_application_details(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found.",
        )

    application = get_application(
        db,
        application_id,
    )

    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Application not found.",
        )

    if application.candidate_id != candidate.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own applications.",
        )

    delete_application(
        db,
        application,
    )