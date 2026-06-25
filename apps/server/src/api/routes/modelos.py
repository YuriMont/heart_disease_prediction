from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.modelo import Modelo
from schemas.dashboard import ModeloInfo, ModeloMetricas
from schemas.modelo import ModeloUpdate
from services import prediction_service as servico

router = APIRouter(prefix="/modelos", tags=["modelos"])


@router.get("", response_model=list[ModeloInfo])
def listar_modelos(db: Session = Depends(get_db)):
    """Lista apenas os modelos ativos (ativo=True)."""
    metricas = db.query(Modelo).filter(Modelo.ativo.is_(True)).all()
    return [
        ModeloInfo(
            nome=m.nome,
            descricao=m.descricao or m.nome,
            ativo=m.ativo,
        )
        for m in metricas
    ]


@router.get("/{modelo_id}/metricas", response_model=ModeloMetricas)
def obter_metricas(modelo_id: str, db: Session = Depends(get_db)):
    """Métricas de desempenho de um modelo."""
    if modelo_id not in servico.MODELOS:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{modelo_id}' não encontrado.",
        )

    metrica_db = db.query(Modelo).filter(Modelo.id == modelo_id).first()

    if not metrica_db:
        raise HTTPException(
            status_code=404,
            detail=f"Métricas do modelo '{modelo_id}' não disponíveis. Execute o treino primeiro.",
        )

    return ModeloMetricas(
        nome=metrica_db.nome,
        acuracia=metrica_db.acuracia,
        precisao=metrica_db.precisao,
        recall=metrica_db.recall,
        f1_score=metrica_db.f1_score,
        auc_roc=metrica_db.auc_roc,
        atualizacao=metrica_db.atualizado_em.strftime("%d/%m/%Y %H:%M"),
    )


@router.patch("/{modelo_id}", response_model=ModeloInfo)
def atualizar_modelo(modelo_id: str, dados: ModeloUpdate, db: Session = Depends(get_db)):
    """Edita o nome, a descrição e/ou a flag ativo de um modelo."""
    metrica_db = db.query(Modelo).filter(Modelo.id == modelo_id).first()

    if not metrica_db:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{modelo_id}' não encontrado no banco. Execute o treino primeiro.",
        )

    if dados.nome is not None:
        metrica_db.nome = dados.nome

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
