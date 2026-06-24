from services.prediction_service import MODELOS, NOMES_FEATURES, SCALER

# Mapeamento de colunas one-hot para features originais
_FEATURE_MAP = {
    "age": ["age"],
    "sexo": ["sex_1"],
    "cp": ["cp_2", "cp_3", "cp_4"],
    "trestbps": ["trestbps"],
    "chol": ["chol"],
    "fbs": ["fbs_1"],
    "restecg": ["restecg_1", "restecg_2"],
    "thalach": ["thalach"],
    "exang": ["exang_1"],
    "oldpeak": ["oldpeak"],
    "slope": ["slope_2", "slope_3"],
    "ca": ["ca_1.0", "ca_2.0", "ca_3.0"],
    "thal": ["thal_6.0", "thal_7.0"],
}

_NOMES_EXIBICAO = {
    "age": "Idade",
    "sexo": "Sexo",
    "cp": "Dor no peito",
    "trestbps": "Pressão em repouso",
    "chol": "Colesterol",
    "fbs": "Glicemia jejum",
    "restecg": "ECG em repouso",
    "thalach": "Freq. cardíaca máx.",
    "exang": "Angina exercício",
    "oldpeak": "Depressão ST",
    "slope": "Inclinação ST",
    "ca": "Vasos coloridos",
    "thal": "Talassemia",
}

# Direção de risco para categorias (positivo = risco, negativo = protetor)
_DIRECAO_CATEGORIAS = {
    "sex_1": 1,
    "cp_2": -0.5,
    "cp_3": -0.3,
    "cp_4": -0.8,
    "fbs_1": 0.3,
    "restecg_1": 0.2,
    "restecg_2": 0.5,
    "exang_1": 0.7,
    "slope_2": 0.3,
    "slope_3": 0.7,
    "ca_1.0": 0.6,
    "ca_2.0": 0.8,
    "ca_3.0": 1.0,
    "thal_6.0": 0.5,
    "thal_7.0": 0.9,
}


def _obter_importancia_rf():
    """Extrai a importância das features do modelo Random Forest treinado."""
    if "random_forest" not in MODELOS:
        return {}, {}

    rf = MODELOS["random_forest"]
    importancias = rf.feature_importances_

    # Importância agrupada por feature original
    agrupada = {}
    for nome_orig, cols_onehot in _FEATURE_MAP.items():
        total = sum(
            importancias[NOMES_FEATURES.index(c)]
            for c in cols_onehot
            if c in NOMES_FEATURES
        )
        agrupada[nome_orig] = round(total, 4)

    # Importância por coluna one-hot (para fatores contribuintes)
    por_onehot = {nome: round(importancias[i], 4) for i, nome in enumerate(NOMES_FEATURES)}

    return agrupada, por_onehot


def calcular_importancia_features():
    """Retorna a importância global das features do modelo RF (agrupadas por feature original)."""
    importancia_agrupada, _ = _obter_importancia_rf()

    return sorted(
        [
            {"variavel": _NOMES_EXIBICAO[k], "peso": v}
            for k, v in importancia_agrupada.items()
        ],
        key=lambda x: x["peso"],
        reverse=True,
    )


def calcular_fatores_contribuintes(avaliacao) -> list[dict]:
    """Calcula fatores contribuintes para uma avaliação usando dados reais do RF.

    Para features contínuas: impacto = importância × (valor - média_escalada) / std_escalada
    Para features categóricas: impacto = importância_da_categoria × direção_do_risco
    """
    importancia_agrupada, importancia_onehot = _obter_importancia_rf()

    # Medidas do scaler (dados de treino)
    scaler_medias = dict(zip(NOMES_FEATURES, SCALER.mean_))
    scaler_stds = dict(zip(NOMES_FEATURES, SCALER.scale_))

    fatores = []

    # Features contínuas
    _adicionar_fator_continuo(
        fatores, "Pressão em repouso", avaliacao.trestbps, "mmHg",
        importancia_agrupada.get("trestbps", 0), scaler_medias.get("trestbps", 0),
        scaler_stds.get("trestbps", 1),
    )
    _adicionar_fator_continuo(
        fatores, "Colesterol", avaliacao.chol, "mg/dL",
        importancia_agrupada.get("chol", 0), scaler_medias.get("chol", 0),
        scaler_stds.get("chol", 1),
    )
    _adicionar_fator_continuo(
        fatores, "Idade", avaliacao.age, "anos",
        importancia_agrupada.get("age", 0), scaler_medias.get("age", 0),
        scaler_stds.get("age", 1),
    )
    _adicionar_fator_continuo(
        fatores, "Freq. cardíaca máx.", avaliacao.thalach, "bpm",
        importancia_agrupada.get("thalach", 0), scaler_medias.get("thalach", 0),
        scaler_stds.get("thalach", 1),
    )
    _adicionar_fator_continuo(
        fatores, "Depressão ST", avaliacao.oldpeak, "mm",
        importancia_agrupada.get("oldpeak", 0), scaler_medias.get("oldpeak", 0),
        scaler_stds.get("oldpeak", 1),
    )

    # Features categóricas (usando importâncias one-hot)
    _adicionar_fator_categoria(
        fatores, "Dor no peito", avaliacao.cp,
        {1: "Típica", 2: "Atípica", 3: "Não anginosa", 4: "Assintomática"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Inclinação ST", avaliacao.slope,
        {1: "Subida", 2: "Plano", 3: "Descida"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Talassemia", avaliacao.thal,
        {3: "Normal", 6: "Fixo", 7: "Reversível"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Vasos coloridos", avaliacao.ca,
        {0: "Nenhum", 1: "1 vaso", 2: "2 vasos", 3: "3 vasos"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Sexo", avaliacao.sex,
        {0: "Feminino", 1: "Masculino"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Angina exercício", avaliacao.exang,
        {0: "Não", 1: "Sim"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "Glicemia jejum", avaliacao.fbs,
        {0: "Normal", 1: "Elevada"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )
    _adicionar_fator_categoria(
        fatores, "ECG em repouso", avaliacao.restecg,
        {0: "Normal", 1: "Anormalidade", 2: "Hipertrofia"},
        importancia_onehot, _DIRECAO_CATEGORIAS,
    )

    fatores.sort(key=lambda f: abs(f["impacto"]), reverse=True)
    return fatores


def _adicionar_fator_continuo(fatores, nome, valor, unidade, importancia, media, std):
    """Adiciona um fator contribuinte para uma feature contínua."""
    if std == 0:
        std = 1
    z_score = (valor - media) / std
    impacto = importancia * z_score

    fatores.append({
        "variavel": nome,
        "valor": f"{int(valor)} {unidade}",
        "impacto": round(impacto, 2),
    })


def _adicionar_fator_categoria(fatores, nome, valor, mapa_nomes, importancia_rf, direcoes):
    """Adiciona um fator contribuinte para uma feature categórica."""
    # Mapeia valor do banco → coluna one-hot
    coluna_onehot = _encontrar_onehot(nome, valor, importancia_rf)

    if coluna_onehot and coluna_onehot in importancia_rf:
        importancia_col = importancia_rf[coluna_onehot]
        direcao = direcoes.get(coluna_onehot, 0)
        impacto = importancia_col * direcao
    else:
        impacto = 0

    fatores.append({
        "variavel": nome,
        "valor": mapa_nomes.get(valor, f"Tipo {valor}"),
        "impacto": round(impacto, 2),
    })


def _encontrar_onehot(nome_feature, valor, importancia_rf):
    """Encontra a coluna one-hot correspondente ao valor da feature categórica."""
    mapa = {
        "Dor no peito": {2: "cp_2", 3: "cp_3", 4: "cp_4"},
        "Inclinação ST": {2: "slope_2", 3: "slope_3"},
        "Talassemia": {6: "thal_6.0", 7: "thal_7.0"},
        "Vasos coloridos": {1: "ca_1.0", 2: "ca_2.0", 3: "ca_3.0"},
        "Sexo": {1: "sex_1"},
        "Angina exercício": {1: "exang_1"},
        "Glicemia jejum": {1: "fbs_1"},
        "ECG em repouso": {1: "restecg_1", 2: "restecg_2"},
    }
    return mapa.get(nome_feature, {}).get(valor)
