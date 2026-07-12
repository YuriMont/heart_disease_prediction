from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from fastapi_cache.decorator import cache
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
from schemas.result import ContributingFactor, FeatureImportance
from services import prediction_service as servico
from services.feature_analysis import (
    calculate_contributing_factors,
    calculate_feature_importance,
)
from services.recommendations import generate_recommendations
from services.report_pdf import generate_pdf_report

router = APIRouter(tags=["evaluations"])


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
    patient_name: str | None = Query(None, description="Filtrar por nome do paciente"),
    has_disease: bool | None = Query(
        None, description="Filtrar por resultado (true = doença, false = saudável)"
    ),
    model_used: str | None = Query(None, description="Filtrar por modelo utilizado"),
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


@router.get(
    "/evaluations/{evaluation_id}/factors",
    response_model=list[ContributingFactor],
    summary="Fatores contribuintes da avaliação",
    description="Retorna os fatores clínicos que mais contribuíram para o resultado de uma avaliação específica, com o impacto de cada variável. Cache de 5 minutos.",
    response_description="Lista de fatores contribuintes com variável, valor e impacto",
)
@cache(expire=300)
async def get_factors(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    fatores = calculate_contributing_factors(evaluation)
    return fatores


@router.get(
    "/evaluations/{evaluation_id}/importance",
    response_model=list[FeatureImportance],
    summary="Importância das variáveis no modelo",
    description="Retorna a importância relativa de cada variável clínica no modelo de ML utilizado por uma avaliação específica. Cache de 5 minutos.",
    response_description="Lista de variáveis com seus pesos de importância no modelo",
)
@cache(expire=300)
async def get_importance(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")

    dados = calculate_feature_importance(evaluation.model_used)
    return dados


@router.get(
    "/evaluations/{evaluation_id}/recommendations",
    response_model=list[str],
    summary="Recomendações da avaliação",
    description="Retorna recomendações dinâmicas baseadas no nível de risco, fatores contribuintes e variáveis clínicas alteradas da avaliação.",
    response_description="Lista de recomendações personalizadas",
)
@cache(expire=300)
async def get_recommendations(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(evaluation_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")
    factors = calculate_contributing_factors(evaluation)
    recs = generate_recommendations(evaluation, factors)
    return recs


@router.post(
    "/evaluations/{evaluation_id}/report-pdf",
    summary="Exportar relatório em PDF",
    description="Gera e retorna um PDF formatado com os resultados da avaliação de risco cardíaco, dados clínicos, fatores contribuintes, importância das características e recomendações.",
    response_class=StreamingResponse,
    responses={
        200: {
            "description": "Relatório PDF",
            "content": {
                "application/pdf": {
                    "schema": {
                        "type": "string",
                        "format": "binary",
                    }
                }
            },
        }
    },
)
@cache(expire=300)
async def export_report_pdf(evaluation_id: UUID, db: Session = Depends(get_db)):
    evaluation = (
        db.query(Evaluation).options(joinedload(Evaluation.patient)).get(evaluation_id)
    )
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")

    factors = calculate_contributing_factors(evaluation)
    importance = calculate_feature_importance(evaluation.model_used)

    pdf_buf = generate_pdf_report(evaluation, factors, importance)

    filename = f"cardiopredict-relatorio-{evaluation_id}.pdf"
    return StreamingResponse(
        pdf_buf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
