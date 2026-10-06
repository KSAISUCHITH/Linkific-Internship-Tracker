from sqlalchemy.orm import Session

from app.models.candidate import CandidateProfile


def create_candidate_profile(
    db: Session,
    user_id: int,
    headline: str | None,
    bio: str | None,
    location: str | None,
    skills: str | None,
    resume_url: str | None,
):
    profile = CandidateProfile(
        user_id=user_id,
        headline=headline,
        bio=bio,
        location=location,
        skills=skills,
        resume_url=resume_url,
    )

    db.add(profile)
    db.commit()
    db.refresh(profile)

    return profile


def get_candidate_profile(
    db: Session,
    profile_id: int,
):
    return (
        db.query(CandidateProfile)
        .filter(CandidateProfile.id == profile_id)
        .first()
    )


def get_candidate_profile_by_user(
    db: Session,
    user_id: int,
):
    return (
        db.query(CandidateProfile)
        .filter(CandidateProfile.user_id == user_id)
        .first()
    )


def get_candidate_profiles(
    db: Session,
):
    return (
        db.query(CandidateProfile)
        .all()
    )


def update_candidate_profile(
    db: Session,
    profile: CandidateProfile,
    data: dict,
):
    for field, value in data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)

    return profile


def delete_candidate_profile(
    db: Session,
    profile: CandidateProfile,
):
    db.delete(profile)
    db.commit()