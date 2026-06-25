from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db
from models.metrica import ModelMetrica
from schemas.dashboard import ModeloInfo, ModeloMetricas
from schemas.modelo import NomeModelo, ModeloUpdate
from services import prediction_service as servico

router = APIRouter(prefix="/modelos", tags=["modelos"])

NOMES_MODELOS = {
    "ensemble": "Ensemble",
    "random_forest": "Random Forest",
    "svm": "SVM",
    "knn": "KNN",
}


@router.get("", response_model=list[ModeloInfo])
def listar_modelos(db: Session = Depends(get_db)):
    """Lista apenas os modelos ativos (ativo=True)."""
    metricas = db.query(ModelMetrica).filter(ModelMetrica.ativo == True).all()
    return [
        ModeloInfo(
            nome=m.nome,
            descricao=m.descricao or m.nome,
            ativo=m.ativo,
        )
        for m in metricas
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


@router.patch("/{nome_modelo}", response_model=ModeloInfo)
def atualizar_modelo(nome_modelo: NomeModelo, dados: ModeloUpdate, db: Session = Depends(get_db)):
    """Edita a descrição e/ou a flag ativo de um modelo."""
    modelo_valor = nome_modelo.value

    metrica_db = db.query(ModelMetrica).filter(ModelMetrica.id == modelo_valor).first()

    if not metrica_db:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{modelo_valor}' não encontrado no banco. Execute o treino primeiro.",
        )

    if dados.descricao is not None:
        metrica_db.descricao = dados.descricao

    if dados.ativo is not None:
        metrica_db.ativo = dados.ativo

    db.commit()
    db.refresh(metrica_db)

    return ModeloInfo(
        nome=metrica_db.nome,
        descricao=metrica_db.descricao or metrica_db.nome,
        ativo=metrica_db.ativo,
    )
