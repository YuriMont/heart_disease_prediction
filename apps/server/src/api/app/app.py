from contextlib import asynccontextmanager

from fastapi import FastAPI

from database.connection import create_tables
from api.routes import dashboard, models, pages, patients, reports, result

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

app.include_router(pages.router)
app.include_router(dashboard.router)
app.include_router(patients.router)
app.include_router(result.router)
app.include_router(models.router)
app.include_router(reports.router)
