from pydantic import BaseModel


class ContributingFactor(BaseModel):
    variable: str
    value: str
    impact: float


class FeatureImportance(BaseModel):
    variable: str
    weight: float
