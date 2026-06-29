from contextlib import asynccontextmanager

from fastapi import FastAPI

from database.connection import create_tables
from api.routes import dashboard, models as modelos, pages as paginas, patients as pacientes, prediction as previsao, reports as relatorios, result as resultado

from fastapi.middleware.cors import CORSMiddleware
from api.middleware.redirect import RedirectMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_tables()
    yield


app = FastAPI(
    title="CardioPredict Heart Disease Prediction API",
    description="Accepts patient clinical data and predicts heart disease risk.",
    version="2.0.0",
    lifespan=lifespan,
)

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RedirectMiddleware)

app.include_router(paginas.router)
app.include_router(previsao.router)
app.include_router(dashboard.router)
app.include_router(pacientes.router)
app.include_router(resultado.router)
app.include_router(modelos.router)
app.include_router(relatorios.router)
