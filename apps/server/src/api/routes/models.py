from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.model import Model
from schemas.dashboard import ModelInfo, ModelMetrics
from schemas.model import ModelUpdate

router = APIRouter(prefix="/models", tags=["models"])


@router.get(
    "",
    response_model=list[ModelInfo],
    summary="Listar modelos ativos",
    description="Retorna todos os modelos de IA disponíveis que estão ativos para predição de risco cardíaco.",
    response_description="Lista de modelos ativos com ID, nome, descrição e status",
)
def list_models(db: Session = Depends(get_db)):
    modelos = db.query(Model).filter(Model.active.is_(True)).all()
    return [
        ModelInfo(
            id=m.id,
            name=m.name,
            description=m.description or m.name,
            active=m.active,
        )
        for m in modelos
    ]


@router.get(
    "/{model_id}/metrics",
    response_model=ModelMetrics,
    summary="Métricas de desempenho do modelo",
    description="Retorna as métricas de desempenho (acurácia, precisão, recall, F1-Score, AUC-ROC) de um modelo específico treinado.",
    response_description="Métricas de desempenho do modelo solicitado",
)
def get_metrics(model_id: str, db: Session = Depends(get_db)):
    modelo_db = db.query(Model).filter(Model.id == model_id).first()

    if not modelo_db:
        raise HTTPException(
            status_code=404,
            detail=f"Metrics for model '{model_id}' not available. Run training first.",
        )

    return ModelMetrics(
        id=modelo_db.id,
        name=modelo_db.name,
        accuracy=modelo_db.accuracy,
        precision=modelo_db.precision,
        recall=modelo_db.recall,
        f1_score=modelo_db.f1_score,
        auc_roc=modelo_db.auc_roc,
        updated_at=modelo_db.updated_at.strftime("%d/%m/%Y %H:%M"),
    )


@router.patch(
    "/{model_id}",
    response_model=ModelInfo,
    summary="Atualizar modelo",
    description="Atualiza as configurações de um modelo existente: nome, descrição ou status ativo/inativo.",
    response_description="Modelo atualizado com os novos valores",
)
def update_model(model_id: str, dados: ModelUpdate, db: Session = Depends(get_db)):
    modelo_db = db.query(Model).filter(Model.id == model_id).first()

    if not modelo_db:
        raise HTTPException(
            status_code=404,
            detail=f"Model '{model_id}' not found in database. Run training first.",
        )

    if dados.name is not None:
        modelo_db.name = dados.name

    if dados.description is not None:
        modelo_db.description = dados.description

    if dados.active is not None:
        modelo_db.active = dados.active

    db.commit()
    db.refresh(modelo_db)

    return ModelInfo(
        id=modelo_db.id,
        name=modelo_db.name,
        description=modelo_db.description or modelo_db.name,
        active=modelo_db.active,
    )
