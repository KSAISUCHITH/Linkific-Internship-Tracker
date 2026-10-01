from sqlalchemy.orm import Session

from app.crud.users import (
    create_user,
    get_user_by_email,
)
from app.core.security import (
    create_access_token,
    hash_password,
    verify_password,
)


def register_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: str,
):
    normalized_email = (
        email.strip().lower()
    )

    existing_user = get_user_by_email(
        db,
        normalized_email,
    )

    if existing_user:
        raise ValueError(
            "An account with this email already exists"
        )

    password_hash = hash_password(
        password
    )

    return create_user(
        db=db,
        name=name.strip(),
        email=normalized_email,
        password_hash=password_hash,
        role=role,
    )


def authenticate_user(
    db: Session,
    email: str,
    password: str,
):
    user = get_user_by_email(
        db,
        email.strip().lower(),
    )

    if not user:
        return None

    if not verify_password(
        password,
        user.password_hash,
    ):
        return None

    return user


def login_user(
    db: Session,
    email: str,
    password: str,
):
    user = authenticate_user(
        db,
        email,
        password,
    )

    if not user:
        return None

    return create_access_token(
        user_id=user.id,
        role=user.role,
    )