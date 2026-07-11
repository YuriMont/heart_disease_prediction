from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_analyses: int
    low_risk: int
    medium_risk: int
    high_risk: int


class RiskDistribution(BaseModel):
    risk: str
    quantity: int
    percentage: float


class RiskFactor(BaseModel):
    name: str
    short_name: str
    weight: float


class RiskFactorsResponse(BaseModel):
    model_name: str
    model_description: str
    factors: list[RiskFactor]


class ModelInfo(BaseModel):
    id: str
    name: str
    description: str
    active: bool


class ModelMetrics(BaseModel):
    id: str
    name: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    auc_roc: float
    updated_at: str
