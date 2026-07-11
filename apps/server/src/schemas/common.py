from pydantic import BaseModel


class PaginationMeta(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int


class PaginatedResponse[T](BaseModel):
    data: list[T]
    meta: PaginationMeta
