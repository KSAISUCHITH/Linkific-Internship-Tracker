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
from app.crud.companies import get_company_by_user
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
def create_job_application(
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
            detail="Candidate profile not found. Complete your profile first.",
        )

    job = get_job(
        db,
        request.job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    if (
        job.application_deadline
        and job.application_deadline
        < datetime.now(timezone.utc)
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The application deadline for this job has passed",
        )

    existing_applications = get_applications_by_candidate(
        db,
        candidate.id,
    )

    already_applied = any(
        application.job_id == request.job_id
        for application in existing_applications
    )

    if already_applied:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You have already applied to this job",
        )

    return create_application(
        db=db,
        candidate_id=candidate.id,
        job_id=request.job_id,
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
            detail="Candidate profile not found",
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
    job = get_job(
        db,
        job_id,
    )

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found",
        )

    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found",
        )

    if job.company_id != company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access applications for this job",
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
            detail="Application not found",
        )

    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    company = get_company_by_user(
        db,
        current_user.id,
    )

    is_candidate_owner = (
        candidate is not None
        and application.candidate_id == candidate.id
    )

    is_job_owner = (
        company is not None
        and application.job.company_id == company.id
    )

    if not is_candidate_owner and not is_job_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access this application",
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
            detail="Application not found",
        )

    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    company = get_company_by_user(
        db,
        current_user.id,
    )

    is_candidate_owner = (
        candidate is not None
        and application.candidate_id == candidate.id
    )

    is_job_owner = (
        company is not None
        and application.job.company_id == company.id
    )

    if not is_candidate_owner and not is_job_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access this application history",
        )

    return get_status_history(
        db,
        application_id,
    )


@router.put(
    "/{application_id}",
    response_model=ApplicationResponse,
)
def update_job_application(
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
            detail="Application not found",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    company = get_company_by_user(
        db,
        current_user.id,
    )

    is_candidate_owner = (
        candidate is not None
        and application.candidate_id == candidate.id
    )

    is_job_owner = (
        company is not None
        and application.job.company_id == company.id
    )

    if is_candidate_owner:
        data.pop("status", None)

        if not data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No valid application fields were provided",
            )

    elif is_job_owner:
        if "status" not in data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Recruiters must provide a status update",
            )

        if data["status"] not in ALLOWED_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid application status",
            )

        data = {
            "status": data["status"],
        }

    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this application",
        )

    return update_application(
        db,
        application,
        data,
    )


@router.delete(
    "/{application_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
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

    candidate = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    if not candidate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found",
        )

    if application.candidate_id != candidate.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this application",
        )

    delete_application(
        db,
        application,
    )