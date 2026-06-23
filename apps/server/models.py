"""Modelos ORM do banco de dados.

Define as tabelas: Paciente, Avaliacao, Relatorio.
"""

from datetime import datetime

from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship

from database import Base


class Paciente(Base):
    __tablename__ = "pacientes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    nome = Column(String(200), nullable=True)
    idade = Column(Integer, nullable=False)
    sexo = Column(Integer, nullable=False)  # 1=masculino, 0=feminino
    criado_em = Column(DateTime, default=datetime.utcnow)

    avaliacoes = relationship("Avaliacao", back_populates="paciente")


class Avaliacao(Base):
    __tablename__ = "avaliacoes"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    paciente_id = Column(Integer, ForeignKey("pacientes.id"), nullable=False)

    # 13 campos clínicos do Heart Disease
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

    # Resultado da predição
    modelo_usado = Column(String(50), nullable=False)
    tem_doenca = Column(Integer, nullable=False)  # 0 ou 1
    probabilidade_doenca = Column(Float, nullable=False)
    resultado_texto = Column(String(200), nullable=False)

    criado_em = Column(DateTime, default=datetime.utcnow)

    paciente = relationship("Paciente", back_populates="avaliacoes")
    relatorio = relationship("Relatorio", back_populates="avaliacao", uselist=False)


class Relatorio(Base):
    __tablename__ = "relatorios"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    avaliacao_id = Column(Integer, ForeignKey("avaliacoes.id"), nullable=False, unique=True)
    titulo = Column(String(300), nullable=False)
    conteudo = Column(Text, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)

    avaliacao = relationship("Avaliacao", back_populates="relatorio")
