from pydantic import BaseModel, Field


class ContributingFactor(BaseModel):
    variable: str = Field(..., description="Nome da variável clínica")
    value: str = Field(..., description="Valor atual da variável no paciente")
    impact: float = Field(
        ...,
        description="Impacto da variável no resultado (positivo = aumenta risco, negativo = diminui risco)",
    )


class FeatureImportance(BaseModel):
    variable: str = Field(..., description="Nome da variável clínica")
    weight: float = Field(
        ..., description="Peso da variável no modelo de ML (importância relativa)"
    )
