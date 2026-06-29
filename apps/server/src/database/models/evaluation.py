from datetime import datetime
from typing import TYPE_CHECKING
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base

if TYPE_CHECKING:
    from database.models.paciente import Paciente
    from database.models.relatorio import Relatorio


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    paciente_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("pacientes.id"),
        nullable=False,
    )

    age: Mapped[int] = mapped_column(Integer, nullable=False)
    sex: Mapped[int] = mapped_column(Integer, nullable=False)
    cp: Mapped[int] = mapped_column(Integer, nullable=False)

    trestbps: Mapped[float] = mapped_column(Float, nullable=False)
    chol: Mapped[float] = mapped_column(Float, nullable=False)

    fbs: Mapped[int] = mapped_column(Integer, nullable=False)
    restecg: Mapped[int] = mapped_column(Integer, nullable=False)

    thalach: Mapped[float] = mapped_column(Float, nullable=False)

    exang: Mapped[int] = mapped_column(Integer, nullable=False)

    oldpeak: Mapped[float] = mapped_column(Float, nullable=False)

    slope: Mapped[int] = mapped_column(Integer, nullable=False)

    ca: Mapped[float] = mapped_column(Float, nullable=False)
    thal: Mapped[float] = mapped_column(Float, nullable=False)

    modelo_usado: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )

    tem_doenca: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    probabilidade_doenca: Mapped[float] = mapped_column(
        Float,
        nullable=False,
    )

    resultado_texto: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    paciente: Mapped["Paciente"] = relationship(
        back_populates="avaliacoes"
    )

    relatorio: Mapped["Relatorio"] = relationship(
        back_populates="avaliacao",
        uselist=False,
        cascade="all, delete-orphan",
    )