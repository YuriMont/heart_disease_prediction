from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database.database import Base


class Relatorio(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    avaliacao_id = Column(Integer, ForeignKey("avaliacoes.id"), nullable=False, unique=True)
    titulo = Column(String(300), nullable=False)
    conteudo = Column(Text, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    avaliacao = relationship("Avaliacao", back_populates="relatorio")
