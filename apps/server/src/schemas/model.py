from pydantic import BaseModel


class ModelUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    active: bool | None = None
