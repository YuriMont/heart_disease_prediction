from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from schemas.relatorio import RelatorioResponse
from database.models.avaliacao import Avaliacao
from database.models.relatorio import Relatorio

router = APIRouter(prefix="/relatorios", tags=["relatorios"])


def _gerar_conteudo(av: Avaliacao) -> str:
    """Gera o conteúdo textual do relatório."""
    risco = "ALTO" if av.probabilidade_doenca >= 0.65 else (
        "MÉDIO" if av.probabilidade_doenca >= 0.35 else "BAIXO"
    )
    return (
        f"RELATÓRIO DE AVALIAÇÃO CARDIOVASCULAR\n"
        f"{'=' * 40}\n\n"
        f"Paciente ID: {av.paciente_id}\n"
        f"Data: {av.criado_em.strftime('%d/%m/%Y %H:%M')}\n"
        f"Modelo: {av.modelo_usado}\n\n"
        f"--- RESULTADO ---\n"
        f"Classificação: {risco} RISCO\n"
        f"Probabilidade: {av.probabilidade_doenca * 100:.1f}%\n"
        f"Conclusão: {av.resultado_texto}\n\n"
        f"--- DADOS CLÍNICOS ---\n"
        f"Idade: {av.age} anos\n"
        f"Sexo: {'Masculino' if av.sex == 1 else 'Feminino'}\n"
        f"Pressão arterial: {av.trestbps} mmHg\n"
        f"Colesterol: {av.chol} mg/dL\n"
        f"Freq. cardíaca máx.: {av.thalach} bpm\n"
        f"Depressão ST: {av.oldpeak} mm\n"
    )


class RelatorioExportar(BaseModel):
    avaliacao_id: UUID


@router.get("", response_model=list[RelatorioResponse])
def listar_relatorios(db: Session = Depends(get_db)):
    """Lista todos os relatórios."""
    return db.query(Relatorio).order_by(Relatorio.criado_em.desc()).all()


@router.get("/{relatorio_id}", response_model=RelatorioResponse)
def obter_relatorio(relatorio_id: UUID, db: Session = Depends(get_db)):
    """Detalhes de um relatório."""
    relatorio = db.query(Relatorio).get(relatorio_id)
    if not relatorio:
        raise HTTPException(status_code=404, detail="Relatório não encontrado.")
    return relatorio


@router.post("/exportar", response_model=RelatorioResponse)
def exportar_relatorio(dados: RelatorioExportar, db: Session = Depends(get_db)):
    """Gera e salva um relatório para uma avaliação."""
    avaliacao = db.query(Avaliacao).get(dados.avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")

    # Verificar se já existe relatório
    existente = db.query(Relatorio).filter_by(avaliacao_id=dados.avaliacao_id).first()
    if existente:
        return existente

    conteudo = _gerar_conteudo(avaliacao)
    titulo = f"Relatório Avaliação #{avaliacao.id} — Paciente #{avaliacao.paciente_id}"

    relatorio = Relatorio(
        avaliacao_id=dados.avaliacao_id,
        titulo=titulo,
        conteudo=conteudo,
    )
    db.add(relatorio)
    db.commit()
    db.refresh(relatorio)
    return relatorio
