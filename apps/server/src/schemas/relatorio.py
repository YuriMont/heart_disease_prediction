from datetime import datetime

from pydantic import BaseModel


class RelatorioResponse(BaseModel):
    id: int
    avaliacao_id: int
    titulo: str
    conteudo: str
    criado_em: datetime

    model_config = {"from_attributes": True}
