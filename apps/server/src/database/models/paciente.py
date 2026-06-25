from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from database.connection import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(200), nullable=True)
    idade = Column(Integer, nullable=False)
    sexo = Column(Integer, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    avaliacoes = relationship("Avaliacao", back_populates="paciente")
from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id: Mapped[UUID] = mapped_column(
        Uuid,
        primary_key=True,
        default=uuid4,
    )

    nome: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True,
    )

    idade: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    sexo: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    avaliacoes: Mapped[list["Avaliacao"]] = relationship(
        back_populates="paciente",
        cascade="all, delete-orphan",
    )