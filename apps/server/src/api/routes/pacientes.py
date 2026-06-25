from schemas.avaliacao import AvaliacaoCreate, AvaliacaoResponse
from schemas.paciente import PacienteCreate, PacienteResponse, Paciente as PacienteInput
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database.database import get_db

from models.avaliacao import Avaliacao
from models.metrica import ModelMetrica
from models.paciente import Paciente
from services import prediction_service as servico

router = APIRouter(tags=["pacientes"])


# ---------------------------------------------------------------------------
# Pacientes
# ---------------------------------------------------------------------------

@router.post("/pacientes", response_model=PacienteResponse)
def criar_paciente(dados: PacienteCreate, db: Session = Depends(get_db)):
    """Cria um novo paciente."""
    paciente = Paciente(nome=dados.nome, idade=dados.idade, sexo=dados.sexo)
    db.add(paciente)
    db.commit()
    db.refresh(paciente)
    return paciente


@router.get("/pacientes", response_model=list[PacienteResponse])
def listar_pacientes(db: Session = Depends(get_db)):
    """Lista todos os pacientes."""
    return db.query(Paciente).order_by(Paciente.criado_em.desc()).all()


@router.get("/pacientes/{paciente_id}", response_model=PacienteResponse)
def obter_paciente(paciente_id: int, db: Session = Depends(get_db)):
    """Detalhes de um paciente."""
    paciente = db.query(Paciente).get(paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")
    return paciente


# ---------------------------------------------------------------------------
# Avaliações
# ---------------------------------------------------------------------------

@router.post("/avaliacoes", response_model=AvaliacaoResponse)
def criar_avaliacao(dados: AvaliacaoCreate, db: Session = Depends(get_db)):
    """Cria avaliação e retorna predição."""
    paciente = db.query(Paciente).get(dados.paciente_id)
    if not paciente:
        raise HTTPException(status_code=404, detail="Paciente não encontrado.")

    if dados.modelo not in servico.MODELOS:
        raise HTTPException(
            status_code=400,
            detail=f"Modelo '{dados.modelo}' não existe. Opções: {list(servico.MODELOS.keys())}",
        )

    metrica_modelo = db.query(ModelMetrica).filter(ModelMetrica.id == dados.modelo).first()
    if not metrica_modelo or not metrica_modelo.ativo:
        raise HTTPException(
            status_code=400,
            detail=f"Modelo '{dados.modelo}' não está ativo. Ative-o antes de usar.",
        )

    paciente_input = PacienteInput(
        age=dados.age, sex=dados.sex, cp=dados.cp,
        trestbps=dados.trestbps, chol=dados.chol, fbs=dados.fbs,
        restecg=dados.restecg, thalach=dados.thalach, exang=dados.exang,
        oldpeak=dados.oldpeak, slope=dados.slope, ca=dados.ca, thal=dados.thal,
    )

    resultado = servico.prever(paciente_input, dados.modelo)

    avaliacao = Avaliacao(
        paciente_id=dados.paciente_id,
        age=dados.age, sex=dados.sex, cp=dados.cp,
        trestbps=dados.trestbps, chol=dados.chol, fbs=dados.fbs,
        restecg=dados.restecg, thalach=dados.thalach, exang=dados.exang,
        oldpeak=dados.oldpeak, slope=dados.slope, ca=dados.ca, thal=dados.thal,
        modelo_usado=resultado["modelo_usado"],
        tem_doenca=1 if resultado["tem_doenca"] else 0,
        probabilidade_doenca=resultado["probabilidade_doenca"],
        resultado_texto=resultado["resultado"],
    )
    db.add(avaliacao)
    db.commit()
    db.refresh(avaliacao)
    return avaliacao


@router.get("/avaliacoes", response_model=list[AvaliacaoResponse])
def listar_avaliacoes(db: Session = Depends(get_db)):
    """Lista todas as avaliações."""
    return db.query(Avaliacao).order_by(Avaliacao.criado_em.desc()).all()


@router.get("/avaliacoes/{avaliacao_id}", response_model=AvaliacaoResponse)
def obter_avaliacao(avaliacao_id: int, db: Session = Depends(get_db)):
    """Detalhes de uma avaliação."""
    avaliacao = db.query(Avaliacao).get(avaliacao_id)
    if not avaliacao:
        raise HTTPException(status_code=404, detail="Avaliação não encontrada.")
    return avaliacao
