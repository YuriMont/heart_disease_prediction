from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base

if TYPE_CHECKING:
    from database.models.evaluation import Evaluation


class Report(Base):
    __tablename__ = "relatorios"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    avaliacao_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("avaliacoes.id"),
        nullable=False,
        unique=True,
    )

    title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    evaluation: Mapped["Evaluation"] = relationship(
        back_populates="report",
        uselist=False,
    )