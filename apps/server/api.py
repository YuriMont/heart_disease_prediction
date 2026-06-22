"""Ponto de entrada da API (como o 'js' / 'index.js' de um projeto Express).

Aqui a gente só faz duas coisas:
    1. cria a aplicação (app)
    2. conecta os arquivos de rotas (pasta 'rotas/') com app.include_router(...)

A lógica de previsão fica em servico.py e as rotas ficam em rotas/.

COMO RODAR (no terminal, dentro da pasta 'server'):

    uv run uvicorn api:app --reload

Depois abra no navegador:  http://127.0.0.1:8000/scalar
"""

from fastapi import FastAPI

from rotas import paginas
from rotas import previsao

# Cria a aplicação. O título e a descrição aparecem na documentação.
app = FastAPI(
    title="API de Predição de Doença Cardíaca",
    description="Recebe os dados de um paciente e prevê o risco de doença cardíaca.",
    version="1.0.0",
)

# Conecta cada arquivo de rotas ao app (equivale ao app.use(...) do Express).
app.include_router(paginas.router)
app.include_router(previsao.router)
