from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field


class ReportResponse(BaseModel):
    id: UUID = Field(..., description="Identificador único do relatório")
    avaliacao_id: UUID = Field(..., description="ID da avaliação associada")
    title: str = Field(..., description="Título do relatório")
    content: str = Field(..., description="Conteúdo textual do relatório")
    created_at: datetime = Field(..., description="Data de criação do relatório")

    model_config = {"from_attributes": True}
