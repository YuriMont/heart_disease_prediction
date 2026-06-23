"""Ponto de entrada da API (como o 'js' / 'index.js' de um projeto Express).

Aqui a gente só faz duas coisas:
    1. cria a aplicação (app)
    2. conecta os arquivos de rotas (pasta 'rotas/') com app.include_router(...)

A lógica de previsão fica em servico.py e as rotas ficam em rotas/.

COMO RODAR (no terminal, dentro da pasta 'server'):

    uv run uvicorn api:app --reload

Depois abra no navegador:  http://127.0.0.1:8000/scalar
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI

from database import criar_tabelas
from rotas import dashboard, modelos, paginas, pacientes, previsao, relatorios, resultado


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Cria as tabelas do banco na inicialização."""
    criar_tabelas()
    yield


app = FastAPI(
    title="API de Predição de Doença Cardíaca",
    description="Recebe os dados de um paciente e prevê o risco de doença cardíaca.",
    version="2.0.0",
    lifespan=lifespan,
)

# Rotas originais
app.include_router(paginas.router)
app.include_router(previsao.router)

# Rotas novas
app.include_router(dashboard.router)
app.include_router(pacientes.router)
app.include_router(resultado.router)
app.include_router(modelos.router)
app.include_router(relatorios.router)
