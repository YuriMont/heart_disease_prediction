from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi_cache.decorator import cache
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.evaluation import Evaluation
from database.models.model import Model
from schemas.dashboard import (
    DashboardStats,
    RiskDistribution,
    RiskFactorsResponse,
)
from services.feature_analysis import calculate_aggregated_factors

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _classify_risk(prob: float) -> str:
    if prob < 0.35:
        return "low"
    elif prob < 0.65:
        return "medium"
    return "high"


@router.get("/stats", response_model=DashboardStats)
def get_stats(db: Session = Depends(get_db)):
    total = db.query(func.count(Evaluation.id)).scalar() or 0
    avaliacoes = db.query(Evaluation.disease_probability).all()

    low = sum(1 for (p,) in avaliacoes if _classify_risk(p) == "low")
    medium = sum(1 for (p,) in avaliacoes if _classify_risk(p) == "medium")
    high = sum(1 for (p,) in avaliacoes if _classify_risk(p) == "high")

    return DashboardStats(
        total_analyses=total,
        low_risk=low,
        medium_risk=medium,
        high_risk=high,
    )


@router.get("/risks", response_model=list[RiskDistribution])
@cache(expire=300)  # 5 Minutos
async def get_risk_distribution(db: Session = Depends(get_db)):
    total = db.query(func.count(Evaluation.id)).scalar() or 0
    if total == 0:
        return []

    avaliacoes = db.query(Evaluation.disease_probability).all()
    contagem = {"low": 0, "medium": 0, "high": 0}

    for (p,) in avaliacoes:
        contagem[_classify_risk(p)] += 1

    return [
        RiskDistribution(
            risk=risco,
            quantity=qtd,
            percentage=round(qtd / total * 100, 1),
        )
        for risco, qtd in contagem.items()
    ]


@router.get("/factors", response_model=RiskFactorsResponse)
@cache(expire=300)  # 5 Minutos
async def get_risk_factors(
    model_id: str | None = Query(None),
    db: Session = Depends(get_db),
):
    if model_id:
        model = db.query(Model).filter(Model.id == model_id).first()
        if not model:
            raise HTTPException(404, "Model not found")
    else:
        model = (
            db.query(Model)
            .filter(Model.active.is_(True))
            .order_by(Model.accuracy.desc())
            .first()
        )
        if not model:
            return RiskFactorsResponse(model_name="", model_description="", factors=[])

    model_name = model.name
    model_description = model.description or model_name

    avaliacoes = db.query(Evaluation).all()
    if not avaliacoes:
        return RiskFactorsResponse(
            model_name=model_name, model_description=model_description, factors=[]
        )

    factors = calculate_aggregated_factors(avaliacoes, model_name)
    return RiskFactorsResponse(
        model_name=model_name, model_description=model_description, factors=factors
    )
