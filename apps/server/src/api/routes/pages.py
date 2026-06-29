from fastapi import APIRouter
from scalar_fastapi import get_scalar_api_reference

from services import prediction_service as servico

router = APIRouter(tags=["general"])


@router.get("/")
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
