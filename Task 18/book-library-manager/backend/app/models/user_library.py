from sqlalchemy import Column, Integer, String, ForeignKey, UniqueConstraint

from app.database.connection import Base


class UserLibrary(Base):
    __tablename__ = "user_library"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )
    book_id = Column(
        Integer,
        ForeignKey("books.id", ondelete="CASCADE"),
        nullable=False
    )

    added_at = Column(String, nullable=False)
    borrowed_at = Column(String, nullable=True)
    downloaded_at = Column(String, nullable=True)
    returned_at = Column(String, nullable=True)

    status = Column(
        String(20),
        nullable=False,
        default="in_library"
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "book_id",
            name="unique_user_book"
        ),
    )
