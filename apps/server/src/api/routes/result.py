from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from uuid import UUID

from database.connection import get_db
from schemas.result import ContributingFactor, FeatureImportance
from database.models.evaluation import Evaluation
from services.feature_analysis import calculate_feature_importance, calculate_contributing_factors

router = APIRouter(tags=["result"])


@router.get("/evaluations/{evaluation_id}/factors", response_model=list[ContributingFactor])
def get_factors(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    fatores = calculate_contributing_factors(evaluation)
    return fatores


@router.get("/evaluations/{evaluation_id}/importance", response_model=list[FeatureImportance])
def get_importance(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")

    dados = calculate_feature_importance(evaluation.model_used)
    return dados
