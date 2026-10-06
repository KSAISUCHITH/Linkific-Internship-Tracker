from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.api.dependencies import require_roles
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
from app.schemas.job import JobCreate, JobResponse, JobUpdate


router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)


def normalize_datetime(value):
    if value is None:
        return None

    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)

    return value


def validate_salary_range(
    salary_min,
    salary_max,
):
    if (
        salary_min is not None
        and salary_max is not None
        and salary_min > salary_max
    ):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Minimum salary cannot exceed maximum salary.",
        )


def validate_deadline(deadline):
    if deadline is None:
        return None

    normalized_deadline = normalize_datetime(deadline)

    if normalized_deadline <= datetime.now(timezone.utc):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Application deadline must be in the future.",
        )

    return normalized_deadline


@router.post(
    "",
    response_model=JobResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_job_posting(
    request: JobCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
):
    company = get_company_by_user(
        db,
        current_user.id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company profile not found. Create your company profile first.",
        )

    validate_salary_range(
        request.salary_min,
        request.salary_max,
    )

    deadline = validate_deadline(
        request.application_deadline
    )

    return create_job(
        db=db,
        company_id=company.id,
        title=request.title.strip(),
        description=request.description.strip(),
        location=(
            request.location.strip()
            if request.location
            else None
        ),
        employment_type=request.employment_type.strip(),
        experience_level=(
            request.experience_level.strip()
            if request.experience_level
            else None
        ),
        salary_min=request.salary_min,
        salary_max=request.salary_max,
        skills=(
            request.skills.strip()
            if request.skills
            else None
        ),
        application_deadline=deadline,
    )


@router.get(
    "",
    response_model=list[JobResponse],
)
def get_all_jobs(
    search: str | None = Query(
        default=None,
        max_length=100,
    ),
    location: str | None = Query(
        default=None,
        max_length=100,
    ),
    employment_type: str | None = Query(
        default=None,
        max_length=50,
    ),
    experience_level: str | None = Query(
        default=None,
        max_length=50,
    ),
    db: Session = Depends(get_db),
):
    return get_jobs(
        db=db,
        search=search,
        location=location,
        employment_type=employment_type,
        experience_level=experience_level,
    )


@router.get(
    "/my-jobs",
    response_model=list[JobResponse],
)
def get_my_jobs(
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("recruiter")),
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

    if not company or job.company_id != company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this job",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    effective_salary_min = data.get(
        "salary_min",
        job.salary_min,
    )

    effective_salary_max = data.get(
        "salary_max",
        job.salary_max,
    )

    validate_salary_range(
        effective_salary_min,
        effective_salary_max,
    )

    if "application_deadline" in data:
        data["application_deadline"] = validate_deadline(
            data["application_deadline"]
        )

    for field in [
        "title",
        "description",
        "location",
        "employment_type",
        "experience_level",
        "skills",
    ]:
        if field in data and isinstance(data[field], str):
            data[field] = data[field].strip()

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

    if not company or job.company_id != company.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this job",
        )

    delete_job(
        db,
        job,
    )