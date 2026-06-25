from datetime import datetime
from uuid import UUID, uuid4

from sqlalchemy import DateTime, ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.base import Base


class Relatorio(Base):
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

    titulo: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    conteudo: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    criado_em: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    avaliacao: Mapped["Avaliacao"] = relationship(
        back_populates="relatorio",
        uselist=False,
    )