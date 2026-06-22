"""Lógica de previsão (a "regra de negócio" da API).

Em projetos Express, esta parte ficaria nos "controllers/services". Aqui
separamos a lógica das rotas: este arquivo carrega os modelos treinados e sabe
como transformar os dados de um paciente em uma previsão. As rotas (pasta
'rotas/') apenas chamam estas funções.
"""

import os

import joblib
import pandas as pd

from ml.dados import COLUNAS_CATEGORICAS
from esquemas import Paciente

# ---------------------------------------------------------------------------
# Carregar, uma única vez, os arquivos treinados (.pkl) da pasta 'artefatos/'.
# ---------------------------------------------------------------------------
PASTA_ARTEFATOS = os.path.join(os.path.dirname(__file__), "artefatos")

# Os nomes (e a ORDEM) das 20 colunas que os modelos esperam receber.
NOMES_FEATURES = joblib.load(os.path.join(PASTA_ARTEFATOS, "feature_names.pkl"))

# O scaler padroniza os números do mesmo jeito que foi feito no treino.
SCALER = joblib.load(os.path.join(PASTA_ARTEFATOS, "scaler.pkl"))

# Carrega todos os modelos disponíveis em um dicionário {nome: modelo}.
MODELOS = {}
for nome_modelo in ["knn", "svm", "random_forest", "ensemble"]:
    caminho = os.path.join(PASTA_ARTEFATOS, f"{nome_modelo}.pkl")
    if os.path.exists(caminho):
        MODELOS[nome_modelo] = joblib.load(caminho)

# Modelo usado quando o usuário não escolhe nenhum (o ensemble costuma ser o melhor).
MODELO_PADRAO = "ensemble"


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


def prever(paciente: Paciente, nome_modelo: str):
    """Faz a previsão para um paciente usando o modelo escolhido.

    Supõe que 'nome_modelo' existe (quem chama deve checar antes).
    """
    features = montar_features(paciente)
    classificador = MODELOS[nome_modelo]

    # predict -> 0 ou 1. predict_proba[0][1] -> probabilidade de ser 1 (ter doença).
    classe = int(classificador.predict(features)[0])
    probabilidade = float(classificador.predict_proba(features)[0][1])

    return {
        "modelo_usado": nome_modelo,
        "tem_doenca": bool(classe == 1),
        "probabilidade_doenca": round(probabilidade, 4),
        "resultado": (
            "Possível doença cardíaca" if classe == 1 else "Sem indício de doença"
        ),
    }
