from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

from schemas.common import PaginatedResponse


class EvaluationCreate(BaseModel):
    paciente_id: UUID = Field(..., description="ID do paciente")
    age: int = Field(..., ge=1, le=120, description="Idade em anos")
    sex: int = Field(
        ..., ge=0, le=1, description="Sexo: 1 = masculino, 0 = feminino"
    )
    cp: int = Field(
        ..., ge=1, le=4, description="Tipo de dor no peito (1 = angina típica, 2 = angina atípica, 3 = dor não anginosa, 4 = assintomático)"
    )
    trestbps: float = Field(..., gt=0, description="Pressão arterial em repouso (mm Hg)")
    chol: float = Field(..., gt=0, description="Colesterol sérico (mg/dl)")
    fbs: int = Field(
        ..., ge=0, le=1, description="Glicemia em jejum > 120 mg/dl (1 = sim, 0 = não)"
    )
    restecg: int = Field(
        ...,
        ge=0,
        le=2,
        description="Resultados do eletrocardiograma em repouso (0 = normal, 1 = anormalidade ST-T, 2 = hipertrofia ventricular esquerda)",
    )
    thalach: float = Field(
        ..., gt=0, description="Frequência cardíaca máxima atingida"
    )
    exang: int = Field(
        ...,
        ge=0,
        le=1,
        description="Angina induzida por exercício (1 = sim, 0 = não)",
    )
    oldpeak: float = Field(
        ...,
        ge=0,
        description="Depressão do segmento ST induzida por exercício em relação ao repouso (mm)",
    )
    slope: int = Field(
        ...,
        ge=1,
        le=3,
        description="Inclinação do segmento ST no pico do exercício (1 = ascendente, 2 = plano, 3 = descendente)",
    )
    ca: float = Field(
        ...,
        ge=0,
        le=3,
        description="Número de vasos principais coloridos por fluoroscopia (0-3)",
    )
    thal: float = Field(
        ...,
        description="Talassemia: 3 = normal, 6 = defeito fixo, 7 = defeito reversível",
    )
    model_id: str = Field(..., description="ID do modelo de IA para predição")


class EvaluationResponse(BaseModel):
    id: UUID = Field(..., description="Identificador único da avaliação")
    paciente_id: UUID = Field(..., description="ID do paciente avaliado")
    patient_name: str | None = Field(
        None, description="Nome do paciente (se disponível)"
    )
    age: int = Field(..., description="Idade em anos")
    sex: int = Field(..., description="Sexo: 1 = masculino, 0 = feminino")
    cp: int = Field(..., description="Tipo de dor no peito (1-4)")
    trestbps: float = Field(..., description="Pressão arterial em repouso (mm Hg)")
    chol: float = Field(..., description="Colesterol sérico (mg/dl)")
    fbs: int = Field(..., description="Glicemia em jejum > 120 mg/dl (1 = sim)")
    restecg: int = Field(
        ..., description="Eletrocardiograma em repouso (0 = normal, 1 = ST-T, 2 = hipertrofia)"
    )
    thalach: float = Field(..., description="Frequência cardíaca máxima atingida")
    exang: int = Field(
        ..., description="Angina induzida por exercício (1 = sim, 0 = não)"
    )
    oldpeak: float = Field(
        ..., description="Depressão do segmento ST no exercício (mm)"
    )
    slope: int = Field(
        ..., description="Inclinação do segmento ST (1 = ascendente, 2 = plano, 3 = descendente)"
    )
    ca: float = Field(
        ..., description="Número de vasos principais coloridos (0-3)"
    )
    thal: float = Field(
        ..., description="Talassemia: 3 = normal, 6 = defeito fixo, 7 = defeito reversível"
    )
    model_used: str = Field(..., description="Nome do modelo de IA utilizado")
    has_disease: bool = Field(
        ..., description="Se o modelo detectou probabilidade de doença cardíaca"
    )
    disease_probability: float = Field(
        ..., description="Probabilidade de doença cardíaca (0.0 a 1.0)"
    )
    result_text: str = Field(..., description="Texto explicativo do resultado")
    created_at: datetime = Field(..., description="Data e hora da avaliação")

    model_config = {"from_attributes": True}


class EvaluationListResponse(PaginatedResponse[EvaluationResponse]):
    pass
