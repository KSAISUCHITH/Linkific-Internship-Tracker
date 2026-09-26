from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.companies import get_company_by_user
from app.crud.jobs import (
    create_job,
    delete_job,
    get_job,
    get_jobs,
    get_jobs_by_company,
    update_job,
)
from app.database.connection import get_db
from app.schemas.job import (
    JobCreate,
    JobResponse,
    JobUpdate,
)


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_posting(
    request: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found",
        )

    if (
        request.salary_min is not None
        and request.salary_max is not None
        and request.salary_min > request.salary_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum salary cannot exceed maximum salary",
        )

    return create_job(
        db=db,
        company_id=company.id,
        title=request.title,
        description=request.description,
        location=request.location,
        employment_type=request.employment_type,
        experience_level=request.experience_level,
        salary_min=request.salary_min,
        salary_max=request.salary_max,
        skills=request.skills,
        application_deadline=request.application_deadline,
    )


@router.get(
    "",
    response_model=list[JobResponse],
)
def get_all_jobs(
    db: Session = Depends(get_db),
):
    return get_jobs(db)


@router.get(
    "/my-jobs",
    response_model=list[JobResponse],
)
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found",
        )

    return get_jobs_by_company(
        db,
        company.id,
    )


@router.get(
    "/{job_id}",
    response_model=JobResponse,
)
def get_job_posting(
    job_id: int,
    db: Session = Depends(get_db),
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

    return job


@router.put(
    "/{job_id}",
    response_model=JobResponse,
)
def update_job_posting(
    job_id: int,
    request: JobUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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

    if not company or job.company_id != company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this job",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    salary_min = data.get(
        "salary_min",
        job.salary_min,
    )

    salary_max = data.get(
        "salary_max",
        job.salary_max,
    )

    if (
        salary_min is not None
        and salary_max is not None
        and salary_min > salary_max
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum salary cannot exceed maximum salary",
        )

    return update_job(
        db,
        job,
        data,
    )


@router.delete(
    "/{job_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_job_posting(
    job_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
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

    if not company or job.company_id != company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this job",
        )

    delete_job(
        db,
        job,
    )