from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.metrica import ModelMetrica
from schemas.dashboard import ModeloInfo, ModeloMetricas
from schemas.modelo import NomeModelo
from services import prediction_service as servico

router = APIRouter(prefix="/modelos", tags=["modelos"])

DESCRICOES = {
    "ensemble": "Votação dos 3 modelos",
    "random_forest": "Floresta aleatória",
    "svm": "Vetores de suporte",
    "knn": "K-vizinhos mais próximos",
}

NOMES_MODELOS = {
    "ensemble": "Ensemble",
    "random_forest": "Random Forest",
    "svm": "SVM",
    "knn": "KNN",
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
def obter_metricas(nome_modelo: NomeModelo, db: Session = Depends(get_db)):
    """Métricas de desempenho de um modelo."""
    modelo_valor = nome_modelo.value

    if modelo_valor not in servico.MODELOS:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{modelo_valor}' não encontrado.",
        )

    metrica_db = db.query(ModelMetrica).filter(ModelMetrica.id == modelo_valor).first()

    if not metrica_db:
        raise HTTPException(
            status_code=404,
            detail=f"Métricas do modelo '{modelo_valor}' não disponíveis. Execute o treino primeiro.",
        )

    return ModeloMetricas(
        nome=NOMES_MODELOS.get(modelo_valor, modelo_valor),
        acuracia=metrica_db.acuracia,
        precisao=metrica_db.precisao,
        recall=metrica_db.recall,
        f1_score=metrica_db.f1_score,
        auc_roc=metrica_db.auc_roc,
        atualizacao=metrica_db.atualizado_em.strftime("%d/%m/%Y %H:%M"),
    )
