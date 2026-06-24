from datetime import datetime

from sqlalchemy import Column, DateTime, Float, String, UniqueConstraint

from database.database import Base


class ModelMetrica(Base):
    __tablename__ = "model_metricas"

    id = Column(String(50), primary_key=True)
    nome = Column(String(100), nullable=False)
    acuracia = Column(Float, nullable=False)
    precisao = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    auc_roc = Column(Float, nullable=False)
    criado_em = Column(DateTime, default=datetime.utcnow)
    atualizado_em = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    __table_args__ = (
        UniqueConstraint("nome", name="uq_model_metrica_nome"),
    )
