from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database.database import Base


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)

    age = Column(Integer, nullable=False)
    sex = Column(Integer, nullable=False)
    cp = Column(Integer, nullable=False)
    trestbps = Column(Float, nullable=False)
    chol = Column(Float, nullable=False)
    fbs = Column(Integer, nullable=False)
    restecg = Column(Integer, nullable=False)
    thalach = Column(Float, nullable=False)
    exang = Column(Integer, nullable=False)
    oldpeak = Column(Float, nullable=False)
    slope = Column(Integer, nullable=False)
    ca = Column(Float, nullable=False)
    thal = Column(Float, nullable=False)

    modelo_usado = Column(String(50), nullable=False)
    tem_doenca = Column(Integer, nullable=False)
    probabilidade_doenca = Column(Float, nullable=False)
    resultado_texto = Column(String(200), nullable=False)

    criado_em = Column(DateTime, default=datetime.utcnow)

    paciente = relationship("Paciente", back_populates="avaliacoes")
    relatorio = relationship("Relatorio", back_populates="avaliacao", uselist=False)
