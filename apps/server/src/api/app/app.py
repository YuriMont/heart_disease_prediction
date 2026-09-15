import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend
from fastapi_cache.backends.redis import RedisBackend
from redis.asyncio import Redis

from api.middleware.redirect import RedirectMiddleware
from api.routes import dashboard, evaluations, models, pages, patients, reports
from database.connection import create_tables

load_dotenv()


@asynccontextmanager
async def lifespan(_: FastAPI):
    create_tables()

    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
    redis_client: Redis | None = None

    try:
        redis_client = Redis.from_url(redis_url, decode_responses=False)
        await redis_client.ping()
        await redis_client.flushdb()
        FastAPICache.init(
            RedisBackend(redis_client),
            prefix="api-cache",
        )
    except Exception as e:
        print(
            f"Warning: Could not connect to Redis at '{redis_url}': {e}. Using in-memory cache."
        )
        FastAPICache.init(InMemoryBackend(), prefix="api-cache")

    yield

    if redis_client:
        await redis_client.close()


app = FastAPI(
    title="CardioPredict Heart Disease Prediction API",
    description="Accepts patient clinical data and predicts heart disease risk.",
    version="2.0.0",
    lifespan=lifespan,
)

origins = []

cors_origins_env = os.getenv("CORS_ORIGINS", "")

if cors_origins_env:
    for origin in cors_origins_env.split(","):
        trimmed = origin.strip()
        if trimmed and trimmed not in origins:
            origins.append(trimmed)

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
