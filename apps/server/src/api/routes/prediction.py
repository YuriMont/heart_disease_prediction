from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.evaluation import Evaluation
from database.models.model import Model
from database.models.patient import Patient
from schemas.evaluation import EvaluationResponse, PredictRequest
from services import prediction_service as servico
from schemas.patient import Patient as PatientInput

router = APIRouter(tags=["prediction"])


@router.post("/predict", response_model=EvaluationResponse)
def predict(
    dados: PredictRequest,
    db: Session = Depends(get_db),
):
    patient = db.query(Patient).get(dados.paciente_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    metrica_modelo = db.query(Model).filter(Model.id == dados.modelo).first()
    if not metrica_modelo or not metrica_modelo.active:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{dados.modelo}' is not active or does not exist. Activate it first.",
        )

    if metrica_modelo.name not in servico.MODELOS:
        raise HTTPException(
            status_code=400,
            detail=f"Model file '{metrica_modelo.name}' not found. Options: {list(servico.MODELOS.keys())}",
        )

    paciente_input = PatientInput(
        age=dados.age, sex=dados.sex, cp=dados.cp,
        trestbps=dados.trestbps, chol=dados.chol, fbs=dados.fbs,
        restecg=dados.restecg, thalach=dados.thalach, exang=dados.exang,
        oldpeak=dados.oldpeak, slope=dados.slope, ca=dados.ca, thal=dados.thal,
    )

    resultado = servico.predict(paciente_input, dados.modelo, db)

    avaliacao = Evaluation(
        paciente_id=dados.paciente_id,
        age=dados.age, sex=dados.sex, cp=dados.cp,
        trestbps=dados.trestbps, chol=dados.chol, fbs=dados.fbs,
        restecg=dados.restecg, thalach=dados.thalach, exang=dados.exang,
        oldpeak=dados.oldpeak, slope=dados.slope, ca=dados.ca, thal=dados.thal,
        model_used=resultado["modelo_usado"],
        has_disease=1 if resultado["tem_doenca"] else 0,
        disease_probability=resultado["probabilidade_doenca"],
        result_text=resultado["resultado"],
    )
    db.add(avaliacao)
    db.commit()
    db.refresh(avaliacao)
    return avaliacao
