from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from database.connection import get_db
from database.models.evaluation import Evaluation
from database.models.report import Report
from schemas.report import ReportResponse

router = APIRouter(prefix="/reports", tags=["reports"])


def _generate_content(evaluation: Evaluation) -> str:
    risk = (
        "HIGH"
        if evaluation.disease_probability >= 0.65
        else ("MEDIUM" if evaluation.disease_probability >= 0.35 else "LOW")
    )
    return (
        f"CARDIOVASCULAR EVALUATION REPORT\n"
        f"{'=' * 40}\n\n"
        f"Patient ID: {evaluation.paciente_id}\n"
        f"Date: {evaluation.created_at.strftime('%d/%m/%Y %H:%M')}\n"
        f"Model: {evaluation.model_used}\n\n"
        f"--- RESULT ---\n"
        f"Classification: {risk} RISK\n"
        f"Probability: {evaluation.disease_probability * 100:.1f}%\n"
        f"Conclusion: {evaluation.result_text}\n\n"
        f"--- CLINICAL DATA ---\n"
        f"Age: {evaluation.age} years\n"
        f"Sex: {'Male' if evaluation.sex == 1 else 'Female'}\n"
        f"Blood pressure: {evaluation.trestbps} mmHg\n"
        f"Cholesterol: {evaluation.chol} mg/dL\n"
        f"Max heart rate: {evaluation.thalach} bpm\n"
        f"ST depression: {evaluation.oldpeak} mm\n"
    )


class ReportExport(BaseModel):
    avaliacao_id: UUID = Field(..., description="ID da avaliação para exportar o relatório")


@router.get(
    "",
    response_model=list[ReportResponse],
    summary="Listar relatórios",
    description="Retorna todos os relatórios exportados, ordenados do mais recente para o mais antigo.",
    response_description="Lista de relatórios exportados",
)
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.get(
    "/{report_id}",
    response_model=ReportResponse,
    summary="Obter relatório por ID",
    description="Retorna os dados de um relatório específico pelo seu identificador único.",
    response_description="Dados do relatório encontrado",
)
def get_report(report_id: UUID, db: Session = Depends(get_db)):
    report = db.query(Report).get(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found.")
    return report


@router.post(
    "/export",
    response_model=ReportResponse,
    summary="Exportar relatório de avaliação",
    description="Gera e exporta um relatório textual com os resultados de uma avaliação de risco cardíaco. Se o relatório já existir, retorna o existente.",
    response_description="Relatório exportado (novo ou já existente)",
)
def export_report(data: ReportExport, db: Session = Depends(get_db)):
    evaluation = db.query(Evaluation).get(data.avaliacao_id)
    if not evaluation:
        raise HTTPException(status_code=404, detail="Evaluation not found.")

    existing = db.query(Report).filter_by(avaliacao_id=data.avaliacao_id).first()
    if existing:
        return existing

    content = _generate_content(evaluation)
    title = f"Evaluation Report #{evaluation.id} — Patient #{evaluation.paciente_id}"

    report = Report(
        avaliacao_id=data.avaliacao_id,
        title=title,
        content=content,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report
