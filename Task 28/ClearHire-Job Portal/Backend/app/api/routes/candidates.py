from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user, require_roles
from app.crud.candidates import (
    create_candidate_profile,
    delete_candidate_profile,
    get_candidate_profile,
    get_candidate_profile_by_user,
    get_candidate_profiles,
    update_candidate_profile,
)
from app.database.connection import get_db
from app.schemas.candidate import (
    CandidateProfileCreate,
    CandidateProfileResponse,
    CandidateProfileUpdate,
)


router = APIRouter(
    prefix="/candidates",
    tags=["Candidates"],
)


@router.post(
    "",
    response_model=CandidateProfileResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_profile(
    request: CandidateProfileCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    existing_profile = get_candidate_profile_by_user(
        db,
        current_user.id,
    )

    if existing_profile:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Candidate profile already exists",
        )

    return create_candidate_profile(
        db=db,
        user_id=current_user.id,
        headline=request.headline,
        bio=request.bio,
        location=request.location,
        skills=request.skills,
        resume_url=request.resume_url,
    )


@router.get(
    "",
    response_model=list[CandidateProfileResponse],
)
def get_all_profiles(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if current_user.role == "candidate":
        profile = get_candidate_profile_by_user(
            db,
            current_user.id,
        )

        return [profile] if profile else []

    if current_user.role == "recruiter":
        return get_candidate_profiles(db)

    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="You do not have permission to access candidate profiles.",
    )


@router.get(
    "/{profile_id}",
    response_model=CandidateProfileResponse,
)
def get_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    profile = get_candidate_profile(
        db,
        profile_id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found",
        )

    if current_user.role == "candidate":
        if profile.user_id != current_user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot access this candidate profile",
            )

    elif current_user.role != "recruiter":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access candidate profiles.",
        )

    return profile


@router.put(
    "/{profile_id}",
    response_model=CandidateProfileResponse,
)
def update_profile(
    profile_id: int,
    request: CandidateProfileUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    profile = get_candidate_profile(
        db,
        profile_id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found",
        )

    if profile.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this profile",
        )

    data = request.model_dump(
        exclude_unset=True,
    )

    return update_candidate_profile(
        db,
        profile,
        data,
    )


@router.delete(
    "/{profile_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_profile(
    profile_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_roles("candidate")),
):
    profile = get_candidate_profile(
        db,
        profile_id,
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found",
        )

    if profile.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot delete this profile",
        )

    delete_candidate_profile(
        db,
        profile,
    )