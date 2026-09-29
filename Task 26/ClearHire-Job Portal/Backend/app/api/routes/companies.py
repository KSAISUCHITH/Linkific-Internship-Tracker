from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.companies import (
    create_company,
    delete_company,
    get_companies,
    get_company,
    get_company_by_user,
    update_company,
)
from app.database.connection import get_db
from app.schemas.company import (
    CompanyCreate,
    CompanyResponse,
    CompanyUpdate,
)


router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


@router.post(
    "",
    response_model=CompanyResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_company_profile(
    request: CompanyCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    existing_company = get_company_by_user(
        db,
        current_user.id,
    )

    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Company profile already exists",
        )

    return create_company(
        db=db,
        user_id=current_user.id,
        name=request.name,
        description=request.description,
        website=request.website,
        location=request.location,
        industry=request.industry,
    )


@router.get(
    "",
    response_model=list[CompanyResponse],
)
def get_all_companies(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_companies(db)


@router.get(
    "/{company_id}",
    response_model=CompanyResponse,
)
def get_company_profile(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    return company


@router.put(
    "/{company_id}",
    response_model=CompanyResponse,
)
def update_company_profile(
    company_id: int,
    request: CompanyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this company",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    return update_company(
        db,
        company,
        data,
    )


@router.delete(
    "/{company_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_company_profile(
    company_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    company = get_company(
        db,
        company_id,
    )

    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Company not found",
        )

    if company.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this company",
        )

    delete_company(
        db,
        company,
    )