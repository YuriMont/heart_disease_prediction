from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.modelo import Modelo
from schemas.dashboard import ModeloInfo, ModeloMetricas
from schemas.modelo import ModeloUpdate

router = APIRouter(prefix="/modelos", tags=["modelos"])


@router.get("", response_model=list[ModeloInfo])
def listar_modelos(db: Session = Depends(get_db)):
    """Lista apenas os modelos ativos (ativo=True)."""
    modelo = db.query(Modelo).filter(Modelo.ativo.is_(True)).all()
    return [
        ModeloInfo(
            id=m.id,
            nome=m.nome,
            descricao=m.descricao or m.nome,
            ativo=m.ativo,
        )
        for m in modelo
    ]


@router.get("/{modelo_id}/metricas", response_model=ModeloMetricas)
def obter_metricas(modelo_id: str, db: Session = Depends(get_db)):
    """Métricas de desempenho de um modelo."""
    modelo_db = db.query(Modelo).filter(Modelo.id == modelo_id).first()

    if not modelo_db:
        raise HTTPException(
            status_code=404,
            detail=f"Métricas do modelo '{modelo_id}' não disponíveis. Execute o treino primeiro.",
        )

    return ModeloMetricas(
        id=modelo_db.id,
        nome=modelo_db.nome,
        acuracia=modelo_db.acuracia,
        precisao=modelo_db.precisao,
        recall=modelo_db.recall,
        f1_score=modelo_db.f1_score,
        auc_roc=modelo_db.auc_roc,
        atualizacao=modelo_db.atualizado_em.strftime("%d/%m/%Y %H:%M"),
    )


@router.patch("/{modelo_id}", response_model=ModeloInfo)
def atualizar_modelo(modelo_id: str, dados: ModeloUpdate, db: Session = Depends(get_db)):
    """Edita o nome, a descrição e/ou a flag ativo de um modelo."""
    modelo_db = db.query(Modelo).filter(Modelo.id == modelo_id).first()

    if not modelo_db:
        raise HTTPException(
            status_code=404,
            detail=f"Modelo '{modelo_id}' não encontrado no banco. Execute o treino primeiro.",
        )

    if dados.nome is not None:
        modelo_db.nome = dados.nome

    if dados.descricao is not None:
        modelo_db.descricao = dados.descricao

    if dados.ativo is not None:
        modelo_db.ativo = dados.ativo

    db.commit()
    db.refresh(modelo_db)

    return ModeloInfo(
        nome=modelo_db.nome,
        descricao=modelo_db.descricao,
        ativo=modelo_db.ativo,
    )
