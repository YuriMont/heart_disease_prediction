from pydantic import BaseModel, Field


class DashboardStats(BaseModel):
    total_analyses: int = Field(..., description="Total de avaliações realizadas")
    low_risk: int = Field(..., description="Quantidade de pacientes com risco baixo")
    medium_risk: int = Field(
        ..., description="Quantidade de pacientes com risco médio"
    )
    high_risk: int = Field(..., description="Quantidade de pacientes com risco alto")


class RiskDistribution(BaseModel):
    risk: str = Field(..., description="Nível de risco: low, medium ou high")
    quantity: int = Field(..., description="Quantidade de pacientes nessa categoria")
    percentage: float = Field(..., description="Percentual em relação ao total")


class RiskFactor(BaseModel):
    name: str = Field(..., description="Nome completo do fator de risco")
    short_name: str = Field(..., description="Nome abreviado do fator de risco")
    weight: float = Field(..., description="Peso/importância do fator no modelo")


class RiskFactorsResponse(BaseModel):
    model_name: str = Field(..., description="Nome do modelo utilizado")
    model_description: str = Field(..., description="Descrição do modelo utilizado")
    factors: list[RiskFactor] = Field(
        ..., description="Lista de fatores de risco agregados"
    )


class ModelInfo(BaseModel):
    id: str = Field(..., description="Identificador único do modelo")
    name: str = Field(..., description="Nome interno do modelo")
    description: str = Field(..., description="Descrição legível do modelo")
    active: bool = Field(..., description="Se o modelo está ativo para predição")


class ModelMetrics(BaseModel):
    id: str = Field(..., description="Identificador único do modelo")
    name: str = Field(..., description="Nome interno do modelo")
    accuracy: float = Field(..., description="Acurácia do modelo")
    precision: float = Field(..., description="Precisão do modelo")
    recall: float = Field(..., description="Recall (sensibilidade) do modelo")
    f1_score: float = Field(..., description="F1-Score do modelo")
    auc_roc: float = Field(..., description="AUC-ROC do modelo")
    updated_at: str = Field(
        ..., description="Data da última atualização das métricas"
    )
