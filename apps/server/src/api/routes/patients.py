from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.patient import Patient
from schemas.common import PaginationMeta
from schemas.patient import PatientCreate, PatientListResponse, PatientResponse

router = APIRouter(tags=["patients"])


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
