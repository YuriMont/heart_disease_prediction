from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.evaluation import Evaluation
from schemas.dashboard import DashboardStats, RiskDistribution, RiskFactor

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
def get_risk_distribution(db: Session = Depends(get_db)):
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


@router.get("/factors", response_model=list[RiskFactor])
def get_risk_factors(db: Session = Depends(get_db)):
    avaliacoes = db.query(Evaluation).all()
    if not avaliacoes:
        return []

    total = len(avaliacoes)

    fatores = [
        (
            "High blood pressure",
            sum(1 for a in avaliacoes if a.trestbps > 140) / total * 100,
        ),
        ("High cholesterol", sum(1 for a in avaliacoes if a.chol > 240) / total * 100),
        ("Chest pain (cp)", sum(1 for a in avaliacoes if a.cp in (1, 2)) / total * 100),
        ("Exercise angina", sum(1 for a in avaliacoes if a.exang == 1) / total * 100),
        ("High blood sugar", sum(1 for a in avaliacoes if a.fbs == 1) / total * 100),
        ("Abnormal ECG", sum(1 for a in avaliacoes if a.restecg != 0) / total * 100),
    ]

    fatores.sort(key=lambda x: x[1], reverse=True)

    return [RiskFactor(name=nome, prevalence=round(prev, 1)) for nome, prev in fatores]
