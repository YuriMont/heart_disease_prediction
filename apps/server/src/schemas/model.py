from pydantic import BaseModel, Field


class ModelFeature(BaseModel):
    field: str = Field(description="Nome interno do campo")
    type: str = Field(description="Tipo do dado: continuous ou categorical")
    display_name: str = Field(description="Nome de exibição em inglês")
    short_name_pt: str | None = Field(None, description="Nome curto em português")
    unit: str | None = Field(None, description="Unidade de medida (para variáveis contínuas)")
    categories: dict[str, str] | None = Field(None, description="Mapeamento de valores para descrições (para variáveis categóricas)")


class ModelUpdate(BaseModel):
    name: str | None = Field(None, description="Novo nome interno do modelo")
    description: str | None = Field(
        None, description="Nova descrição legível do modelo"
    )
    active: bool | None = Field(
        None, description="Ativar ou desativar o modelo para predição"
    )
