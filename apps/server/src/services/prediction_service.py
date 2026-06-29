import os

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from database.models.model import Model
from machine_learning.data import CATEGORICAL_COLUMNS
from schemas.patient import Patient

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")

FEATURE_NAMES = joblib.load(os.path.join(ARTIFACTS_DIR, "feature_names.pkl"))

SCALER = joblib.load(os.path.join(ARTIFACTS_DIR, "scaler.pkl"))

EXCLUDE_ARTIFACTS = {"scaler.pkl", "feature_names.pkl"}

MODELOS = {}
if os.path.isdir(ARTIFACTS_DIR):
    for arquivo in os.listdir(ARTIFACTS_DIR):
        if arquivo.endswith(".pkl") and arquivo not in EXCLUDE_ARTIFACTS:
            nome_modelo = arquivo.removesuffix(".pkl")
            caminho = os.path.join(ARTIFACTS_DIR, arquivo)
            MODELOS[nome_modelo] = joblib.load(caminho)


def assemble_features(paciente: Patient):
    bruto = pd.DataFrame([paciente.model_dump()])

    bruto["ca"] = bruto["ca"].astype(float)
    bruto["thal"] = bruto["thal"].astype(float)

    codificado = pd.get_dummies(bruto, columns=CATEGORICAL_COLUMNS)

    alinhado = codificado.reindex(columns=FEATURE_NAMES, fill_value=0).astype(float)

    escalado = SCALER.transform(alinhado)
    return pd.DataFrame(escalado, columns=FEATURE_NAMES)


def _get_model_by_id(db: Session, modelo_id: str) -> Model:
    modelo = db.query(Model).filter(Model.id == modelo_id, Model.active.is_(True)).first()
    if not modelo:
        raise ValueError(f"Model '{modelo_id}' not found or inactive.")
    return modelo


def _available_models() -> set[str]:
    return set(MODELOS.keys())


def get_default_model_id(db: Session) -> str:
    nomes_disponiveis = _available_models()

    if "ensemble" in nomes_disponiveis:
        modelo = db.query(Model).filter(
            Model.name == "ensemble",
            Model.active.is_(True),
        ).first()
        if modelo:
            return modelo.id

    for nome in nomes_disponiveis:
        modelo = db.query(Model).filter(
            Model.name == nome,
            Model.active.is_(True),
        ).first()
        if modelo:
            return modelo.id

    raise ValueError("No active model with trained artifact found.")


def predict(paciente: Patient, modelo_id: str, db: Session):
    modelo_db = _get_model_by_id(db, modelo_id)

    if modelo_db.name not in _available_models():
        raise ValueError(f"Model file '{modelo_db.name}' not found in artifacts.")

    features = assemble_features(paciente)
    classificador = MODELOS[modelo_db.name]

    classe = int(classificador.predict(features)[0])
    probabilidade = float(classificador.predict_proba(features)[0][1])

    return {
        "modelo_usado": modelo_db.name,
        "tem_doenca": bool(classe == 1),
        "probabilidade_doenca": round(probabilidade, 4),
        "resultado": (
            "Possible heart disease" if classe == 1 else "No indication of disease"
        ),
    }
