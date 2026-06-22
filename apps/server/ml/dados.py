"""Carregar e preparar os dados da base UCI Heart Disease.

Este arquivo cuida de toda a parte de "limpar e organizar" os dados antes
de treinar os modelos. Cada passo fica em uma função separada, com nome em
português, para ficar fácil de ler de cima para baixo.

A ordem dos passos (executada pela função preparar_dados no final) é:
    1. baixar os dados
    2. preencher valores faltantes
    3. limitar valores extremos (outliers)
    4. transformar o alvo em 0 ou 1
    5. separar em treino e teste
    6. transformar categorias em colunas 0/1 (one-hot)
    7. padronizar os números (scaler)
    8. equilibrar as classes (SMOTE)
"""

import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from ucimlrepo import fetch_ucirepo

# Colunas com valores numéricos contínuos (idade, pressão, colesterol...).
COLUNAS_CONTINUAS = ["age", "trestbps", "chol", "thalach", "oldpeak"]

# Colunas categóricas: o número representa uma categoria, não uma quantidade.
COLUNAS_CATEGORICAS = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]


class DadosPreparados:
    """Caixinha simples para guardar os dados já prontos para treinar.

    Em vez de devolver muitos valores soltos, devolvemos um objeto com
    nomes claros: dados.X_treino, dados.y_teste, dados.scaler, etc.
    """

    def __init__(self, X_treino, X_teste, y_treino, y_teste, scaler):
        self.X_treino = X_treino  # dados de entrada para treinar
        self.X_teste = X_teste    # dados de entrada para testar
        self.y_treino = y_treino  # respostas certas do treino (0 ou 1)
        self.y_teste = y_teste    # respostas certas do teste (0 ou 1)
        self.scaler = scaler      # objeto que padroniza os números


def carregar_dados():
    """Baixa a base de doença cardíaca da UCI (id=45) pela internet.

    Devolve duas coisas:
    - X: as características do paciente (idade, sexo, exames...)
    - y: a resposta (se a pessoa tem ou não doença cardíaca)
    """
    base = fetch_ucirepo(id=45)
    X = base.data.features.copy()
    y = base.data.targets.copy()
    return X, y


def preencher_faltantes(X):
    """Preenche valores faltantes (NaN) usando a mediana da coluna.

    As colunas 'ca' e 'thal' às vezes vêm vazias na base original.
    """
    X = X.copy()
    X["ca"] = X["ca"].fillna(X["ca"].median())
    X["thal"] = X["thal"].fillna(X["thal"].median())
    return X


def limitar_outliers(X, colunas=None):
    """Limita valores muito extremos (outliers) usando a regra do IQR.

    Valores muito acima ou muito abaixo do normal são "puxados" para um
    limite, para não atrapalhar o aprendizado do modelo.
    """
    colunas = colunas or COLUNAS_CONTINUAS
    X = X.copy()
    for coluna in colunas:
        q1 = X[coluna].quantile(0.25)
        q3 = X[coluna].quantile(0.75)
        iqr = q3 - q1
        minimo = q1 - 1.5 * iqr
        maximo = q3 + 1.5 * iqr
        X[coluna] = np.where(X[coluna] < minimo, minimo, X[coluna])
        X[coluna] = np.where(X[coluna] > maximo, maximo, X[coluna])
    return X


def codificar_categoricas(X):
    """Transforma colunas categóricas em várias colunas de 0 e 1 (one-hot).

    Exemplo: a coluna 'cp' (que pode ser 1, 2, 3 ou 4) vira as colunas
    cp_2, cp_3 e cp_4. O 'drop_first=True' descarta a primeira categoria
    para evitar informação repetida.
    """
    return pd.get_dummies(X, columns=COLUNAS_CATEGORICAS, drop_first=True)


def escalar(X_treino, X_teste):
    """Padroniza os números para que fiquem na mesma escala (média 0, desvio 1).

    Modelos como KNN e SVM funcionam muito melhor quando os números estão
    na mesma escala. Devolvemos também o 'scaler' para reusar depois na API.
    """
    scaler = StandardScaler()
    colunas = X_treino.columns

    # fit_transform: aprende a escala no treino E já transforma
    X_treino_esc = pd.DataFrame(scaler.fit_transform(X_treino), columns=colunas)
    # transform: usa a MESMA escala aprendida no treino para transformar o teste
    X_teste_esc = pd.DataFrame(scaler.transform(X_teste), columns=colunas)

    return X_treino_esc, X_teste_esc, scaler


def binarizar_alvo(y):
    """Transforma o alvo em apenas dois valores: 0 (não tem) ou 1 (tem doença).

    Na base original a coluna 'num' vai de 0 a 4. Aqui qualquer valor maior
    que 0 vira 1 (tem doença).
    """
    return y["num"].apply(lambda valor: 1 if valor > 0 else 0)


def balancear_smote(X_treino, y_treino, random_state=42):
    """Equilibra as classes criando exemplos sintéticos da classe minoritária.

    Se houver muito mais pacientes "sem doença" do que "com doença", o modelo
    tende a errar. O SMOTE cria exemplos novos para equilibrar.
    """
    smote = SMOTE(random_state=random_state)
    X_bal, y_bal = smote.fit_resample(X_treino, y_treino)
    return X_bal, y_bal


def preparar_dados(test_size=0.2, random_state=42, balancear=True):
    """Executa TODOS os passos acima, na ordem certa, e devolve os dados prontos.

    É só esta função que você precisa chamar de fora (ela usa as outras).
    """
    X, y = carregar_dados()

    X = preencher_faltantes(X)
    X = limitar_outliers(X)
    y = binarizar_alvo(y)

    # Separa em treino (80%) e teste (20%). O 'stratify' mantém a mesma
    # proporção de doentes/saudáveis nos dois grupos.
    X_treino, X_teste, y_treino, y_teste = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    X_treino = codificar_categoricas(X_treino)
    X_teste = codificar_categoricas(X_teste)

    # Garante que treino e teste tenham exatamente as mesmas colunas, na
    # mesma ordem (se faltar alguma no teste, preenche com 0).
    X_teste = X_teste.reindex(columns=X_treino.columns, fill_value=0)

    X_treino, X_teste, scaler = escalar(X_treino, X_teste)

    if balancear:
        X_treino, y_treino = balancear_smote(X_treino, y_treino, random_state)

    return DadosPreparados(X_treino, X_teste, y_treino, y_teste, scaler)
