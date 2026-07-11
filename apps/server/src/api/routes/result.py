from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from fastapi_cache.decorator import cache
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.evaluation import Evaluation
from schemas.result import ContributingFactor, FeatureImportance
from services.feature_analysis import (
    calculate_contributing_factors,
    calculate_feature_importance,
)

router = APIRouter(tags=["result"])


@router.get(
    "/evaluations/{evaluation_id}/factors",
    response_model=list[ContributingFactor],
    summary="Fatores contribuintes da avaliação",
    description="Retorna os fatores clínicos que mais contribuíram para o resultado de uma avaliação específica, com o impacto de cada variável. Cache de 5 minutos.",
    response_description="Lista de fatores contribuintes com variável, valor e impacto",
)
@cache(expire=300)
async def get_factors(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    fatores = calculate_contributing_factors(evaluation)
    return fatores


@router.get(
    "/evaluations/{evaluation_id}/importance",
    response_model=list[FeatureImportance],
    summary="Importância das variáveis no modelo",
    description="Retorna a importância relativa de cada variável clínica no modelo de ML utilizado por uma avaliação específica. Cache de 5 minutos.",
    response_description="Lista de variáveis com seus pesos de importância no modelo",
)
@cache(expire=300)
async def get_importance(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")

    dados = calculate_feature_importance(evaluation.model_used)
    return dados
