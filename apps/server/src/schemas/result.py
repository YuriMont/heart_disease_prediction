from pydantic import BaseModel


class ContributingFactor(BaseModel):
    variavel: str
    valor: str
    impacto: float


class FeatureImportance(BaseModel):
    variavel: str
    peso: float
