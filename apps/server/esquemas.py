"""Formato dos dados que a API recebe e devolve (validação de entrada/saída).

Em projetos Express isso seria feito com Joi ou Zod. Aqui usamos o Pydantic:
basta descrever os campos e seus limites que a validação acontece sozinha.
Se algo vier errado, a API responde com um erro explicando o problema.
"""

from datetime import datetime

from pydantic import BaseModel, Field


# ---------------------------------------------------------------------------
# Entrada: previsão (mantido para compatibilidade com POST /prever)
# ---------------------------------------------------------------------------

class Paciente(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Idade em anos")
    sex: int = Field(..., ge=0, le=1, description="Sexo: 1 = masculino, 0 = feminino")
    cp: int = Field(..., ge=1, le=4, description="Tipo de dor no peito (1 a 4)")
    trestbps: float = Field(..., description="Pressão arterial em repouso (mm Hg)")
    chol: float = Field(..., description="Colesterol (mg/dl)")
    fbs: int = Field(..., ge=0, le=1, description="Glicemia em jejum > 120 mg/dl (1 = sim)")
    restecg: int = Field(..., ge=0, le=2, description="Eletrocardiograma em repouso (0 a 2)")
    thalach: float = Field(..., description="Frequência cardíaca máxima atingida")
    exang: int = Field(..., ge=0, le=1, description="Angina induzida por exercício (1 = sim)")
    oldpeak: float = Field(..., description="Depressão do segmento ST no exercício")
    slope: int = Field(..., ge=1, le=3, description="Inclinação do segmento ST (1 a 3)")
    ca: float = Field(..., ge=0, le=3, description="Nº de vasos principais coloridos (0 a 3)")
    thal: float = Field(..., description="Talassemia: 3 = normal, 6 = fixo, 7 = reversível")

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 54, "sex": 1, "cp": 4, "trestbps": 130, "chol": 250,
                "fbs": 0, "restecg": 0, "thalach": 150, "exang": 0,
                "oldpeak": 1.5, "slope": 2, "ca": 0, "thal": 3,
            }
        }
    }


# ---------------------------------------------------------------------------
# Entrada: criar paciente
# ---------------------------------------------------------------------------

class PacienteCreate(BaseModel):
    nome: str | None = Field(None, max_length=200, description="Nome do paciente")
    idade: int = Field(..., ge=1, le=120, description="Idade em anos")
    sexo: int = Field(..., ge=0, le=1, description="Sexo: 1 = masculino, 0 = feminino")


# ---------------------------------------------------------------------------
# Entrada: criar avaliação (13 campos + modelo)
# ---------------------------------------------------------------------------

class AvaliacaoCreate(BaseModel):
    paciente_id: int = Field(..., description="ID do paciente")
    age: int = Field(..., ge=1, le=120)
    sex: int = Field(..., ge=0, le=1)
    cp: int = Field(..., ge=1, le=4)
    trestbps: float = Field(..., gt=0)
    chol: float = Field(..., gt=0)
    fbs: int = Field(..., ge=0, le=1)
    restecg: int = Field(..., ge=0, le=2)
    thalach: float = Field(..., gt=0)
    exang: int = Field(..., ge=0, le=1)
    oldpeak: float = Field(..., ge=0)
    slope: int = Field(..., ge=1, le=3)
    ca: float = Field(..., ge=0, le=3)
    thal: float = Field(..., ge=3, le=7)
    modelo: str = Field("ensemble", description="Nome do modelo de IA")


# ---------------------------------------------------------------------------
# Saída: respostas
# ---------------------------------------------------------------------------

class PacienteResponse(BaseModel):
    id: int
    nome: str | None
    idade: int
    sexo: int
    criado_em: datetime

    model_config = {"from_attributes": True}


class AvaliacaoResponse(BaseModel):
    id: int
    paciente_id: int
    age: int
    sex: int
    cp: int
    trestbps: float
    chol: float
    fbs: int
    restecg: int
    thalach: float
    exang: int
    oldpeak: float
    slope: int
    ca: float
    thal: float
    modelo_usado: str
    tem_doenca: bool
    probabilidade_doenca: float
    resultado_texto: str
    criado_em: datetime

    model_config = {"from_attributes": True}


class RelatorioResponse(BaseModel):
    id: int
    avaliacao_id: int
    titulo: str
    conteudo: str
    criado_em: datetime

    model_config = {"from_attributes": True}


# ---------------------------------------------------------------------------
# Dashboard
# ---------------------------------------------------------------------------

class DashboardStats(BaseModel):
    total_analises: int
    baixo_risco: int
    medio_risco: int
    alto_risco: int


class RiskDistribution(BaseModel):
    risco: str
    quantidade: int
    percentual: float


class FatorRisco(BaseModel):
    nome: str
    prevalencia: float  # 0-100


class ModeloInfo(BaseModel):
    nome: str
    descricao: str
    ativo: bool


class ModeloMetricas(BaseModel):
    nome: str
    acuracia: float
    auc_roc: float
    sensibilidade: float
    atualizacao: str


# ---------------------------------------------------------------------------
# Resultado detalhado
# ---------------------------------------------------------------------------

class ContributingFactor(BaseModel):
    variavel: str
    valor: str
    impacto: float  # positivo = aumenta risco, negativo = diminui


class FeatureImportance(BaseModel):
    variavel: str
    peso: float
