import os

import joblib
import pandas as pd
from sqlalchemy.orm import Session

from database.models.modelo import Modelo
from machine_learning.dados import COLUNAS_CATEGORICAS
from schemas.paciente import Paciente

# ---------------------------------------------------------------------------
# Carregar, uma única vez, os arquivos treinados (.pkl) da pasta 'artefatos/'.
# ---------------------------------------------------------------------------
PASTA_ARTEFATOS = os.path.join(os.path.dirname(__file__), "..", "artifacts")

# Os nomes (e a ORDEM) das 20 colunas que os modelos esperam receber.
NOMES_FEATURES = joblib.load(os.path.join(PASTA_ARTEFATOS, "feature_names.pkl"))

# O scaler padroniza os números do mesmo jeito que foi feito no treino.
SCALER = joblib.load(os.path.join(PASTA_ARTEFATOS, "scaler.pkl"))

# Arquivos utilitários que NÃO são modelos treinados.
ARTEFATOS_EXCLUIR = {"scaler.pkl", "feature_names.pkl"}

# Carrega todos os modelos disponíveis em um dicionário {nome: modelo}.
MODELOS = {}
if os.path.isdir(PASTA_ARTEFATOS):
    for arquivo in os.listdir(PASTA_ARTEFATOS):
        if arquivo.endswith(".pkl") and arquivo not in ARTEFATOS_EXCLUIR:
            nome_modelo = arquivo.removesuffix(".pkl")
            caminho = os.path.join(PASTA_ARTEFATOS, arquivo)
            MODELOS[nome_modelo] = joblib.load(caminho)


def montar_features(paciente: Paciente):
    """Transforma os dados do paciente nas 20 colunas que o modelo espera.

    Faz o mesmo caminho do treino: cria as colunas 0/1 (one-hot), coloca na
    ordem certa e padroniza com o scaler.
    """
    # Uma tabela com uma única linha: o paciente recebido.
    bruto = pd.DataFrame([paciente.model_dump()])

    # 'ca' e 'thal' precisam ser número decimal (foi assim que o treino gerou
    # as colunas ca_1.0, thal_6.0, etc.).
    bruto["ca"] = bruto["ca"].astype(float)
    bruto["thal"] = bruto["thal"].astype(float)

    # One-hot encoding. NÃO usamos drop_first aqui: o reindex abaixo já
    # seleciona apenas as colunas que o modelo conhece.
    codificado = pd.get_dummies(bruto, columns=COLUNAS_CATEGORICAS)

    # Garante exatamente as 20 colunas certas, na ordem certa. Colunas que
    # não apareceram para este paciente entram com valor 0.
    alinhado = codificado.reindex(columns=NOMES_FEATURES, fill_value=0).astype(float)

    # Padroniza os números e devolve um DataFrame com os nomes das colunas
    # (mesmo formato em que os modelos foram treinados).
    escalado = SCALER.transform(alinhado)
    return pd.DataFrame(escalado, columns=NOMES_FEATURES)


def _obter_modelo_por_id(db: Session, modelo_id: str) -> Modelo:
    """Busca um modelo ativo pelo ID no banco de dados."""
    modelo = db.query(Modelo).filter(Modelo.id == modelo_id, Modelo.ativo.is_(True)).first()
    if not modelo:
        raise ValueError(f"Modelo '{modelo_id}' não encontrado ou inativo.")
    return modelo


def _modelos_disponiveis() -> set[str]:
    """Retorna os nomes dos modelos que possuem artefato .pkl treinado."""
    return set(MODELOS.keys())


def obter_modelo_padrao_id(db: Session) -> str:
    """Retorna o ID do primeiro modelo ativo que tenha artefato treinado."""
    nomes_disponiveis = _modelos_disponiveis()

    # Prioriza 'ensemble' se existir.
    if "ensemble" in nomes_disponiveis:
        modelo = db.query(Modelo).filter(
            Modelo.nome == "ensemble",
            Modelo.ativo.is_(True),
        ).first()
        if modelo:
            return modelo.id

    # Caso contrário, pega o primeiro que tenha artefato.
    for nome in nomes_disponiveis:
        modelo = db.query(Modelo).filter(
            Modelo.nome == nome,
            Modelo.ativo.is_(True),
        ).first()
        if modelo:
            return modelo.id

    raise ValueError("Nenhum modelo ativo com artefato treinado encontrado.")


def prever(paciente: Paciente, modelo_id: str, db: Session):
    """Faz a previsão para um paciente usando o modelo escolhido por ID.

    Args:
        paciente: Dados do paciente.
        modelo_id: ID (UUID) do modelo no banco de dados.
        db: Sessão do banco de dados.
    """
    modelo_db = _obter_modelo_por_id(db, modelo_id)

    if modelo_db.nome not in _modelos_disponiveis():
        raise ValueError(f"Arquivo do modelo '{modelo_db.nome}' não encontrado nos artefatos.")

    features = montar_features(paciente)
    classificador = MODELOS[modelo_db.nome]

    classe = int(classificador.predict(features)[0])
    probabilidade = float(classificador.predict_proba(features)[0][1])

    return {
        "modelo_usado": modelo_db.nome,
        "tem_doenca": bool(classe == 1),
        "probabilidade_doenca": round(probabilidade, 4),
        "resultado": (
            "Possível doença cardíaca" if classe == 1 else "Sem indício de doença"
        ),
    }
