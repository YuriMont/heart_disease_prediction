from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload

from database.connection import get_db
from database.models.evaluation import Evaluation
from database.models.model import Model
from database.models.patient import Patient
from schemas.common import PaginationMeta
from schemas.evaluation import (
    EvaluationCreate,
    EvaluationListResponse,
    EvaluationResponse,
)
from schemas.patient import Patient as PatientInput
from schemas.patient import PatientCreate, PatientListResponse, PatientResponse
from services import prediction_service as servico

router = APIRouter(tags=["patients"])


# ---------------------------------------------------------------------------
# Patients
# ---------------------------------------------------------------------------


@router.post(
    "/patients",
    response_model=PatientResponse,
    summary="Cadastrar paciente",
    description="Cria um novo paciente no sistema com nome, idade e sexo para posterior avaliação de risco cardíaco.",
    response_description="Dados do paciente cadastrado",
)
def create_patient(dados: PatientCreate, db: Session = Depends(get_db)):
    patient = Patient(name=dados.name, age=dados.age, sex=dados.sex)
    db.add(patient)
    db.commit()
    db.refresh(patient)
    return patient


@router.get(
    "/patients",
    response_model=PatientListResponse,
    summary="Listar pacientes",
    description="Retorna a lista de pacientes cadastrados com paginação e filtros opcionais por nome e sexo.",
    response_description="Lista paginada de pacientes",
)
def list_patients(
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(20, ge=1, le=100, description="Itens por página"),
    name: str | None = Query(None, description="Filtrar por nome do paciente"),
    sex: int | None = Query(None, ge=0, le=1, description="Filtrar por sexo (1 = masculino, 0 = feminino)"),
    db: Session = Depends(get_db),
):
    query = db.query(Patient)

    if name:
        query = query.filter(Patient.name.ilike(f"%{name}%"))
    if sex is not None:
        query = query.filter(Patient.sex == sex)

    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)

    items = (
        query.order_by(Patient.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return PatientListResponse(
        data=[PatientResponse.model_validate(p) for p in items],
        meta=PaginationMeta(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        ),
    )


@router.get(
    "/patients/{patient_id}",
    response_model=PatientResponse,
    summary="Obter paciente por ID",
    description="Retorna os dados de um paciente específico pelo seu identificador único.",
    response_description="Dados do paciente encontrado",
)
def get_patient(patient_id: UUID, db: Session = Depends(get_db)):
    patient = db.query(Patient).get(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    return patient


# ---------------------------------------------------------------------------
# Evaluations
# ---------------------------------------------------------------------------


@router.post(
    "/evaluations",
    response_model=EvaluationResponse,
    summary="Criar avaliação de risco",
    description="Envia dados clínicos de um paciente para o modelo de IA e retorna a predição de risco cardíaco. O paciente e o modelo devem existir e estar ativos.",
    response_description="Resultado completo da avaliação com predição de risco",
)
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


@router.get(
    "/evaluations",
    response_model=EvaluationListResponse,
    summary="Listar avaliações",
    description="Retorna o histórico de avaliações de risco cardíaco com paginação e filtros opcionais por nome do paciente, resultado (doença/saudável) e modelo utilizado.",
    response_description="Lista paginada de avaliações realizadas",
)
def list_evaluations(
    page: int = Query(1, ge=1, description="Número da página"),
    limit: int = Query(20, ge=1, le=100, description="Itens por página"),
    patient_name: str | None = Query(
        None, description="Filtrar por nome do paciente"
    ),
    has_disease: bool | None = Query(
        None, description="Filtrar por resultado (true = doença, false = saudável)"
    ),
    model_used: str | None = Query(
        None, description="Filtrar por modelo utilizado"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(Evaluation).options(joinedload(Evaluation.patient))

    if patient_name:
        query = query.join(Evaluation.patient).filter(
            Patient.name.ilike(f"%{patient_name}%")
        )
    if has_disease is not None:
        query = query.filter(Evaluation.has_disease == (1 if has_disease else 0))
    if model_used:
        query = query.filter(Evaluation.model_used == model_used)

    total = query.count()
    total_pages = max(1, (total + limit - 1) // limit)

    items = (
        query.order_by(Evaluation.created_at.desc())
        .offset((page - 1) * limit)
        .limit(limit)
        .all()
    )

    return EvaluationListResponse(
        data=[EvaluationResponse.model_validate(e) for e in items],
        meta=PaginationMeta(
            total=total,
            page=page,
            limit=limit,
            total_pages=total_pages,
        ),
    )


@router.get(
    "/evaluations/{evaluation_id}",
    response_model=EvaluationResponse,
    summary="Obter avaliação por ID",
    description="Retorna os dados completos de uma avaliação de risco cardíaco específica.",
    response_description="Dados completos da avaliação encontrada",
)
def get_evaluation(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    return evaluation
