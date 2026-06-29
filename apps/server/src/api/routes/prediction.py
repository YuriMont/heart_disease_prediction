from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from services import prediction_service as servico
from schemas.patient import Patient

router = APIRouter(tags=["prediction"])


@router.post("/predict")
def predict(
    paciente: Patient,
    modelo: str | None = None,
    db: Session = Depends(get_db),
):
    try:
        if modelo is None:
            modelo = servico.get_default_model_id(db)
        return servico.predict(paciente, modelo, db)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
