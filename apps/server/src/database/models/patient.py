from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base

if TYPE_CHECKING:
    from database.models.evaluation import Evaluation


class Patient(Base):
    __tablename__ = "pacientes"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    name: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    age: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    sex: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    evaluations: Mapped[list["Evaluation"]] = relationship(
        back_populates="patient",
        cascade="all, delete-orphan",
    )
