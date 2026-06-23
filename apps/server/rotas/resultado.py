"""Rotas de resultado detalhado: fatores contribuintes e importância."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from esquemas import ContributingFactor, FeatureImportance
from models import Avaliacao

router = APIRouter(tags=["resultado"])

# Pesos aproximados de importância das variáveis no modelo ensemble
PESOS_FEATURES = {
    "Pressão em repouso": 0.28,
    "Colesterol": 0.21,
    "Idade": 0.17,
    "Dor no peito": 0.13,
    "Freq. cardíaca máx.": 0.11,
    "Vasos coloridos": 0.10,
    "Depressão ST": 0.09,
    "Talassemia": 0.08,
    "Inclinação ST": 0.07,
    "ECG em repouso": 0.06,
    "Glicemia jejum": 0.05,
    "Angina exercício": 0.04,
    "Sexo": 0.03,
}


def _calcular_fatores(av: Avaliacao) -> list[ContributingFactor]:
    """Gera fatores contribuintes baseado nos dados do paciente."""
    fatores = []

    # Pressão arterial
    impacto = 0.0
    if av.trestbps > 140:
        impacto = 0.21
    elif av.trestbps > 130:
        impacto = 0.10
    elif av.trestbps < 100:
        impacto = -0.05
    fatores.append(ContributingFactor(
        variavel="Pressão em repouso",
        valor=f"{int(av.trestbps)} mmHg",
        impacto=round(impacto, 2),
    ))

    # Dor no peito
    cp_impacto = {1: 0.18, 2: 0.08, 3: 0.02, 4: -0.03}
    cp_nomes = {1: "Típica", 2: "Atípica", 3: "Não anginosa", 4: "Assintomática"}
    fatores.append(ContributingFactor(
        variavel="Dor no peito",
        valor=cp_nomes.get(av.cp, f"Tipo {av.cp}"),
        impacto=round(cp_impacto.get(av.cp, 0), 2),
    ))

    # Colesterol
    impacto = 0.15 if av.chol > 240 else (0.05 if av.chol > 200 else -0.03)
    fatores.append(ContributingFactor(
        variavel="Colesterol",
        valor=f"{int(av.chol)} mg/dL",
        impacto=round(impacto, 2),
    ))

    # Idade
    impacto = 0.11 if av.age > 55 else (0.04 if av.age > 45 else -0.02)
    fatores.append(ContributingFactor(
        variavel="Idade",
        valor=f"{av.age} anos",
        impacto=round(impacto, 2),
    ))

    # Inclinação ST
    slope_impacto = {1: 0.07, 2: 0.02, 3: -0.04}
    slope_nomes = {1: "Subida", 2: "Plano", 3: "Descida"}
    fatores.append(ContributingFactor(
        variavel="Inclinação ST",
        valor=slope_nomes.get(av.slope, f"Tipo {av.slope}"),
        impacto=round(slope_impacto.get(av.slope, 0), 2),
    ))

    # Talassemia
    thal_impacto = {3: -0.04, 6: 0.10, 7: 0.15}
    thal_nomes = {3: "Normal", 6: "Fixo", 7: "Reversível"}
    fatores.append(ContributingFactor(
        variavel="Talassemia",
        valor=thal_nomes.get(av.thal, f"Tipo {av.thal}"),
        impacto=round(thal_impacto.get(av.thal, 0), 2),
    ))

    # Ordenar por impacto absoluto (maior primeiro)
    fatores.sort(key=lambda f: abs(f.impacto), reverse=True)
    return fatores


@router.get("/avaliacoes/{avaliacao_id}/fatores", response_model=list[ContributingFactor])
def obter_fatores(avaliacao_id: int, db: Session = Depends(get_db)):
    """Fatores contribuintes para a predição."""
    avaliacao = db.query(Avaliacao).get(avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")
    return _calcular_fatores(avaliacao)


@router.get("/avaliacoes/{avaliacao_id}/importancia", response_model=list[FeatureImportance])
def obter_importancia(avaliacao_id: int, db: Session = Depends(get_db)):
    """Importância global das variáveis no modelo."""
    avaliacao = db.query(Avaliacao).get(avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")

    return sorted(
        [FeatureImportance(variavel=k, peso=v) for k, v in PESOS_FEATURES.items()],
        key=lambda f: f.peso,
        reverse=True,
    )
