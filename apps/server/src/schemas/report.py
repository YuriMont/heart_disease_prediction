from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: UUID
    avaliacao_id: UUID
    title: str
    content: str
    created_at: datetime

    model_config = {"from_attributes": True}
