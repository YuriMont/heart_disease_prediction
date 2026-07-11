from pydantic import BaseModel, Field


class ModelUpdate(BaseModel):
    name: str | None = Field(None, description="Novo nome interno do modelo")
    description: str | None = Field(
        None, description="Nova descrição legível do modelo"
    )
    active: bool | None = Field(
        None, description="Ativar ou desativar o modelo para predição"
    )
