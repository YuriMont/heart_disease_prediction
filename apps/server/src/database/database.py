import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

PASTA_BANCO = os.path.dirname(__file__)
CAMINHO_BANCO = os.path.join(PASTA_BANCO, "cardiopredict.db")

engine = create_engine(
    f"sqlite:///{CAMINHO_BANCO}",
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def criar_tabelas():
    """Cria todas as tabelas definidas nos models."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """Dependency do FastAPI: fornece uma sessão por request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
