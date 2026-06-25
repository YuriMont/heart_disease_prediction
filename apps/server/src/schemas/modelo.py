from pydantic import BaseModel

class ModeloUpdate(BaseModel):
    nome: str | None = None
    descricao: str | None = None
    ativo: bool | None = None
