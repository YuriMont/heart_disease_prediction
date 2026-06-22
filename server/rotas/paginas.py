"""Rotas gerais: página inicial e documentação Scalar.

Equivale a um 'routes/home.js' no Express.
"""

from fastapi import APIRouter
from scalar_fastapi import get_scalar_api_reference

import servico

router = APIRouter(tags=["geral"])


@router.get("/")
def inicio():
    """Página inicial: confirma que a API está no ar."""
    return {
        "mensagem": "API de predição de doença cardíaca está no ar!",
        "modelos_disponiveis": list(servico.MODELOS.keys()),
        "como_usar": "Envie um POST para /prever.",
        "documentacao": {
            "scalar": "/scalar",  # interface moderna
            "swagger": "/docs",   # interface padrão do FastAPI
            "redoc": "/redoc",    # outra opção do FastAPI
        },
    }


@router.get("/scalar", include_in_schema=False)
def documentacao_scalar():
    """Documentação da API com a interface Scalar (alternativa moderna ao Swagger).

    O FastAPI já oferece o Swagger em /docs e o ReDoc em /redoc. Esta rota
    adiciona uma terceira opção, o Scalar. Acesse em /scalar.
    """
    return get_scalar_api_reference(
        openapi_url="/openapi.json",  # o FastAPI gera este JSON sozinho
        title="API de Predição de Doença Cardíaca",
    )
