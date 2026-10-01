from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.crud.notifications import (
    get_notification,
    get_notifications,
    mark_notification_as_read,
)
from app.database.connection import get_db


router = APIRouter(
    prefix="/notifications",
    tags=["Notifications"],
)


@router.get("")
def get_user_notifications(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    return get_notifications(
        db,
        current_user.id,
    )


@router.get("/{notification_id}")
def get_user_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot access this notification",
        )

    return notification


@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    notification = get_notification(
        db,
        notification_id,
    )

    if not notification:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Notification not found",
        )

    if notification.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You cannot update this notification",
        )

    return mark_notification_as_read(
        db,
        notification,
    )