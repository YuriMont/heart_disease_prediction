from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from database.base import Base

BASE_DIR = Path(__file__).parent
DB_PATH = BASE_DIR / "cardiopredict.db"

engine = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
    echo=False,
)

SessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
)


def criar_tabelas() -> None:
    # Importa os modelos para que suas tabelas sejam registradas no metadata
    # da Base antes de criá-las.
    import database.models  # noqa: F401

    Base.metadata.create_all(bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()