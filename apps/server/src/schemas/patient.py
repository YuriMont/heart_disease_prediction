from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class Paciente(BaseModel):
    age: int = Field(..., ge=1, le=120, description="Idade em anos")
    sex: int = Field(..., ge=0, le=1, description="Sexo: 1 = masculino, 0 = feminino")
    cp: int = Field(..., ge=1, le=4, description="Tipo de dor no peito (1 a 4)")
    trestbps: float = Field(..., description="Pressao arterial em repouso (mm Hg)")
    chol: float = Field(..., description="Colesterol (mg/dl)")
    fbs: int = Field(..., ge=0, le=1, description="Glicemia em jejum > 120 mg/dl (1 = sim)")
    restecg: int = Field(..., ge=0, le=2, description="Eletrocardiograma em repouso (0 a 2)")
    thalach: float = Field(..., description="Frequencia cardiaca maxima atingida")
    exang: int = Field(..., ge=0, le=1, description="Angina induzida por exercicio (1 = sim)")
    oldpeak: float = Field(..., description="Depressao do segmento ST no exercicio")
    slope: int = Field(..., ge=1, le=3, description="Inclinacao do segmento ST (1 a 3)")
    ca: float = Field(..., ge=0, le=3, description="No de vasos principais coloridos (0 a 3)")
    thal: float = Field(..., description="Talassemia: 3 = normal, 6 = fixo, 7 = reversivel")

    model_config = {
        "json_schema_extra": {
            "example": {
                "age": 54, "sex": 1, "cp": 4, "trestbps": 130, "chol": 250,
                "fbs": 0, "restecg": 0, "thalach": 150, "exang": 0,
                "oldpeak": 1.5, "slope": 2, "ca": 0, "thal": 3,
            }
        }
    }


class PacienteCreate(BaseModel):
    nome: str | None = Field(None, max_length=200, description="Nome do paciente")
    idade: int = Field(..., ge=1, le=120, description="Idade em anos")
    sexo: int = Field(..., ge=0, le=1, description="Sexo: 1 = masculino, 0 = feminino")


class PacienteResponse(BaseModel):
    id: UUID
    nome: str | None
    idade: int
    sexo: int
    criado_em: datetime

    model_config = {"from_attributes": True}
