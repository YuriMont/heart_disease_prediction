"""Rotas de modelos de IA: listar, métricas, trocar ativo."""

from fastapi import APIRouter, HTTPException

from esquemas import ModeloInfo, ModeloMetricas
import servico as servico

router = APIRouter(prefix="/modelos", tags=["modelos"])

# Métricas mockadas (em produção viriam de um banco de métricas)
METRICAS = {
    "ensemble": ModeloMetricas(
        nome="Ensemble",
        acuracia=0.942,
        auc_roc=0.96,
        sensibilidade=0.918,
        atualizacao="12/06/2026",
    ),
    "random_forest": ModeloMetricas(
        nome="Random Forest",
        acuracia=0.921,
        auc_roc=0.94,
        sensibilidade=0.895,
        atualizacao="12/06/2026",
    ),
    "svm": ModeloMetricas(
        nome="SVM",
        acuracia=0.898,
        auc_roc=0.92,
        sensibilidade=0.872,
        atualizacao="12/06/2026",
    ),
    "knn": ModeloMetricas(
        nome="KNN",
        acuracia=0.885,
        auc_roc=0.90,
        sensibilidade=0.860,
        atualizacao="12/06/2026",
    ),
}

DESCRICOES = {
    "ensemble": "Votação dos 3 modelos",
    "random_forest": "Floresta aleatória",
    "svm": "Vetores de suporte",
    "knn": "K-vizinhos mais próximos",
}


@router.get("", response_model=list[ModeloInfo])
def listar_modelos():
    """Lista todos os modelos disponíveis."""
    return [
        ModeloInfo(
            nome=nome,
            descricao=DESCRICOES.get(nome, nome),
            ativo=(nome == servico.MODELO_PADRAO),
        )
        for nome in servico.MODELOS.keys()
    ]


@router.get("/{nome_modelo}/metricas", response_model=ModeloMetricas)
def obter_metricas(nome_modelo: str):
    """Métricas de desempenho de um modelo."""
    if nome_modelo not in servico.MODELOS:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{nome_modelo}' não encontrado.",
        )
    metricas = METRICAS.get(nome_modelo)
    if not metricas:
        raise HTTPException(
            status_code=404,
            detail=f"Métricas do modelo '{nome_modelo}' não disponíveis.",
        )
    return metricas
