from pydantic import BaseModel


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
    prevalencia: float


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
