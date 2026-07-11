from fastapi import APIRouter
from scalar_fastapi import get_scalar_api_reference

from services import prediction_service as servico

router = APIRouter(tags=["general"])


@router.get(
    "/",
    summary="Página inicial da API",
    description="Retorna o status da API CardioPredict, lista os modelos disponíveis e links para documentação.",
    response_description="Mensagem de status com modelos disponíveis e links de documentação",
)
def home():
    return {
        "message": "CardioPredict heart disease prediction API is running!",
        "available_models": list(servico.MODELOS.keys()),
        "how_to_use": "Send a POST to /predict.",
        "documentation": {
            "scalar": "/scalar",
            "swagger": "/docs",
            "redoc": "/redoc",
        },
    }


@router.get("/scalar", include_in_schema=False)
def documentation_scalar():
    return get_scalar_api_reference(
        openapi_url="/openapi.json",
        title="CardioPredict Heart Disease Prediction API",
    )
