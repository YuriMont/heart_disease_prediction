from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from uuid import UUID

from database.connection import get_db
from schemas.resultado import ContributingFactor, FeatureImportance
from database.models.avaliacao import Avaliacao
from services.feature_analysis import calcular_importancia_features, calcular_fatores_contribuintes

router = APIRouter(tags=["resultado"])


@router.get("/avaliacoes/{avaliacao_id}/fatores", response_model=list[ContributingFactor])
def obter_fatores(avaliacao_id: UUID, db: Session = Depends(get_db)):
    """Fatores contribuintes para a predição (derivados do modelo RF treinado)."""
    avaliacao = db.query(Avaliacao).get(avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")
    fatores = calcular_fatores_contribuintes(avaliacao)
    return fatores


@router.get("/avaliacoes/{avaliacao_id}/importancia", response_model=list[FeatureImportance])
def obter_importancia(avaliacao_id: UUID, db: Session = Depends(get_db)):
    """Importância global das variáveis no modelo RF treinado."""
    avaliacao = db.query(Avaliacao).get(avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")

    dados = calcular_importancia_features()
    return dados
