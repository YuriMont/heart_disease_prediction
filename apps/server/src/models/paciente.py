from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(200), nullable=True)
    idade = Column(Integer, nullable=False)
    sexo = Column(Integer, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    avaliacoes = relationship("Avaliacao", back_populates="paciente")
