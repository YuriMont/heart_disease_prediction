from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from database.connection import get_db
from database.models.evaluation import Evaluation
from database.models.model import Model
from database.models.patient import Patient
from schemas.evaluation import EvaluationCreate, EvaluationResponse
from schemas.patient import Patient as PatientInput
from schemas.patient import PatientCreate, PatientResponse
from services import prediction_service as servico

router = APIRouter(tags=["patients"])


# ---------------------------------------------------------------------------
# Patients
# ---------------------------------------------------------------------------


@router.post("/patients", response_model=PatientResponse)
def create_patient(dados: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(name=dados.name, age=dados.age, sex=dados.sex)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get("/patients", response_model=list[PatientResponse])
def list_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.created_at.desc()).all()


@router.get("/patients/{patient_id}", response_model=PatientResponse)
def get_patient(patient_id: UUID, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient


# ---------------------------------------------------------------------------
# Evaluations
# ---------------------------------------------------------------------------


@router.post("/evaluations", response_model=EvaluationResponse)
def create_evaluation(dados: EvaluationCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(dados.paciente_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")

    metrica_modelo = db.query(Model).filter(Model.id == dados.model_id).first()
    if not metrica_modelo or not metrica_modelo.active:
        raise HTTPException(
            status_code=400,
            detail=f"Model '{dados.model_id}' is not active or does not exist. Activate it first.",
        )

    if metrica_modelo.name not in servico.MODELOS:
        raise HTTPException(
            status_code=400,
            detail=f"Model file '{metrica_modelo.name}' not found. Options: {list(servico.MODELOS.keys())}",
        )

    paciente_input = PatientInput(
        age=dados.age,
        sex=dados.sex,
        cp=dados.cp,
        trestbps=dados.trestbps,
        chol=dados.chol,
        fbs=dados.fbs,
        restecg=dados.restecg,
        thalach=dados.thalach,
        exang=dados.exang,
        oldpeak=dados.oldpeak,
        slope=dados.slope,
        ca=dados.ca,
        thal=dados.thal,
    )

    resultado = servico.predict(paciente_input, dados.model_id, db)

    avaliacao = Evaluation(
        paciente_id=dados.paciente_id,
        age=dados.age,
        sex=dados.sex,
        cp=dados.cp,
        trestbps=dados.trestbps,
        chol=dados.chol,
        fbs=dados.fbs,
        restecg=dados.restecg,
        thalach=dados.thalach,
        exang=dados.exang,
        oldpeak=dados.oldpeak,
        slope=dados.slope,
        ca=dados.ca,
        thal=dados.thal,
        model_used=resultado["modelo_usado"],
        has_disease=1 if resultado["tem_doenca"] else 0,
        disease_probability=resultado["probabilidade_doenca"],
        result_text=resultado["resultado"],
    )
    db.add(avaliacao)
    db.commit()
    db.refresh(avaliacao)
    return EvaluationResponse(
        **{c.name: getattr(avaliacao, c.name) for c in Evaluation.__table__.columns},
        patient_name=patient.name if patient else None,
    )


@router.get("/evaluations", response_model=list[EvaluationResponse])
def list_evaluations(db: Session = Depends(get_db)):
    return (
        db.query(Evaluation)
        .options(joinedload(Evaluation.patient))
        .order_by(Evaluation.created_at.desc())
        .all()
    )


@router.get("/evaluations/{evaluation_id}", response_model=EvaluationResponse)
def get_evaluation(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    return evaluation
