from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from services import prediction_service as servico
from schemas.paciente import Paciente

router = APIRouter(tags=["previsão"])


@router.post("/prever")
def prever(
    paciente: Paciente,
    modelo: str | None = None,
    db: Session = Depends(get_db),
):
    """Recebe um paciente e devolve a previsão de doença cardíaca.

    Para escolher outro modelo, passe o ID do modelo como query string. Exemplo:
        POST /prever?modelo=<uuid-do-modelo>
    """
    try:
        if modelo is None:
            modelo = servico.obter_modelo_padrao_id(db)
        return servico.prever(paciente, modelo, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
