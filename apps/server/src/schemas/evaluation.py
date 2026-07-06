from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class EvaluationCreate(BaseModel):
    paciente_id: UUID = Field(..., description="ID do paciente")
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
    model_id: str = Field(..., description="ID do modelo de IA")




class EvaluationResponse(BaseModel):
    id: UUID
    paciente_id: UUID
    patient_name: str | None
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
    model_used: str
    has_disease: bool
    disease_probability: float
    result_text: str
    created_at: datetime

    model_config = {"from_attributes": True}
