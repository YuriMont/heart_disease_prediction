from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class RelatorioResponse(BaseModel):
    id: UUID
    avaliacao_id: UUID
    titulo: str
    conteudo: str
    criado_em: datetime

    model_config = {"from_attributes": True}
