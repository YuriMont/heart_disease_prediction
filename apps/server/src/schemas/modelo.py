from enum import Enum

from pydantic import BaseModel


class NomeModelo(str, Enum):
    knn = "knn"
    svm = "svm"
    random_forest = "random_forest"
    ensemble = "ensemble"


class ModeloUpdate(BaseModel):
    descricao: str | None = None
    ativo: bool | None = None
