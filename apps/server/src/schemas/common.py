from pydantic import BaseModel, Field


class PaginationMeta(BaseModel):
    total: int = Field(..., description="Total de registros")
    page: int = Field(..., description="Página atual")
    limit: int = Field(..., description="Itens por página")
    total_pages: int = Field(..., description="Total de páginas")


class PaginatedResponse[T](BaseModel):
    data: list[T] = Field(..., description="Lista de itens da página atual")
    meta: PaginationMeta = Field(..., description="Metadados de paginação")
