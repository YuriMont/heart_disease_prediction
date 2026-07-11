from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis.asyncio import Redis

from api.middleware.redirect import RedirectMiddleware
from api.routes import dashboard, evaluations, models, pages, patients, reports
from database.connection import create_tables

redis: Redis | None = None


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_tables()

    redis = Redis(host="localhost", port=6379, decode_responses=False)

    FastAPICache.init(
        RedisBackend(redis),
        prefix="api-cache",
    )

    yield

    await redis.close()


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
app.include_router(evaluations.router)
app.include_router(models.router)
app.include_router(reports.router)
