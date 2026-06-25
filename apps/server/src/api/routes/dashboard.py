from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.dashboard import DashboardStats, FatorRisco, RiskDistribution
from database.models.avaliacao import Avaliacao

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _classificar_risco(prob: float) -> str:
    """Classifica a probabilidade em faixa de risco."""
    if prob < 0.35:
        return "baixo"
    elif prob < 0.65:
        return "medio"
    return "alto"


@router.get("/stats", response_model=DashboardStats)
def obter_stats(db: Session = Depends(get_db)):
    """Total de análises e contagem por faixa de risco."""
    total = db.query(func.count(Avaliacao.id)).scalar() or 0
    avaliacoes = db.query(Avaliacao.probabilidade_doenca).all()

    baixo = sum(1 for (p,) in avaliacoes if _classificar_risco(p) == "baixo")
    medio = sum(1 for (p,) in avaliacoes if _classificar_risco(p) == "medio")
    alto = sum(1 for (p,) in avaliacoes if _classificar_risco(p) == "alto")

    return DashboardStats(
        total_analises=total,
        baixo_risco=baixo,
        medio_risco=medio,
        alto_risco=alto,
    )


@router.get("/risks", response_model=list[RiskDistribution])
def obter_distribuicao_risco(db: Session = Depends(get_db)):
    """Distribuição percentual de risco (dados para o donut chart)."""
    total = db.query(func.count(Avaliacao.id)).scalar() or 0
    if total == 0:
        return []

    avaliacoes = db.query(Avaliacao.probabilidade_doenca).all()
    contagem = {"baixo": 0, "medio": 0, "alto": 0}

    for (p,) in avaliacoes:
        contagem[_classificar_risco(p)] += 1

    return [
        RiskDistribution(
            risco=risco,
            quantidade=qtd,
            percentual=round(qtd / total * 100, 1),
        )
        for risco, qtd in contagem.items()
    ]


@router.get("/fatores", response_model=list[FatorRisco])
def obter_fatores_risco(db: Session = Depends(get_db)):
    """Top fatores de risco com prevalência entre os pacientes avaliados."""
    avaliacoes = db.query(Avaliacao).all()
    if not avaliacoes:
        return []

    total = len(avaliacoes)

    fatores = [
        ("Pressão elevada", sum(1 for a in avaliacoes if a.trestbps > 140) / total * 100),
        ("Colesterol alto", sum(1 for a in avaliacoes if a.chol > 240) / total * 100),
        ("Dor no peito (cp)", sum(1 for a in avaliacoes if a.cp in (1, 2)) / total * 100),
        ("Angina ao esforço", sum(1 for a in avaliacoes if a.exang == 1) / total * 100),
        ("Glicemia alta", sum(1 for a in avaliacoes if a.fbs == 1) / total * 100),
        ("ECG alterado", sum(1 for a in avaliacoes if a.restecg != 0) / total * 100),
    ]

    fatores.sort(key=lambda x: x[1], reverse=True)

    return [
        FatorRisco(nome=nome, prevalencia=round(prev, 1))
        for nome, prev in fatores
    ]
