"""Rotas relacionadas à previsão de doença cardíaca.

Equivale a um arquivo 'routes/previsao.js' no Express, com um Router.
Aqui criamos um APIRouter e penduramos nele as rotas /modelos e /prever.
"""

from fastapi import APIRouter, HTTPException

import servico
from esquemas import Paciente

# O APIRouter é o "Router" do FastAPI. As rotas definidas aqui só passam a
# existir depois que o api.py fizer app.include_router(router).
router = APIRouter(tags=["previsão"])


@router.get("/modelos")
def listar_modelos():
    """Lista quais modelos podem ser usados na previsão."""
    return {
        "modelos_disponiveis": list(servico.MODELOS.keys()),
        "padrao": servico.MODELO_PADRAO,
    }


@router.post("/prever")
def prever(paciente: Paciente, modelo: str = servico.MODELO_PADRAO):
    """Recebe um paciente e devolve a previsão de doença cardíaca.

    Para escolher outro modelo, use a query string. Exemplo:
        POST /prever?modelo=random_forest
    """
    # Se o usuário pedir um modelo que não existe, devolve erro 400.
    if modelo not in servico.MODELOS:
        raise HTTPException(
            status_code=400,
            detail=f"Modelo '{modelo}' não existe. Opções: {list(servico.MODELOS.keys())}",
        )

    return servico.prever(paciente, modelo)
