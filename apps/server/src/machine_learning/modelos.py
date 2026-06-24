from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC


def _criar_ensemble():
    """Monta o modelo 'ensemble': junta KNN + SVM + Random Forest e faz uma votação.

    A previsão final é a combinação das previsões dos três modelos (voting="soft"
    usa as probabilidades de cada um).
    """
    estimadores = [
        ("knn", KNeighborsClassifier(n_neighbors=5)),
        ("svm", SVC(probability=True, random_state=42)),
        ("rf", RandomForestClassifier(n_estimators=200, random_state=42)),
    ]
    return VotingClassifier(estimators=estimadores, voting="soft")


MODELOS = [
    {
        "nome": "knn",
        "estimador": KNeighborsClassifier(),
        "parametros": {
            "n_neighbors": [3, 5, 7, 9, 11, 13, 15],
            "weights": ["uniform", "distance"],
            "metric": ["euclidean", "manhattan"],
        },
    },
    {
        "nome": "svm",
        "estimador": SVC(probability=True, random_state=42),
        "parametros": {
            "C": [0.1, 1, 10, 100],
            "kernel": ["linear", "rbf"],
            "gamma": ["scale", "auto"],
        },
    },
    {
        "nome": "random_forest",
        "estimador": RandomForestClassifier(random_state=42),
        "parametros": {
            "n_estimators": [100, 200, 300],
            "max_features": ["sqrt", "log2"],
            "max_depth": [4, 6, 8, None],
            "criterion": ["gini", "entropy"],
        },
    },
    {
        "nome": "ensemble",
        "estimador": _criar_ensemble(),
        "parametros": {},  # o ensemble não tem parâmetros para testar
    },
]


def treinar_modelo(estimador, parametros, X_treino, y_treino, cv=5):
    """Procura a melhor combinação de parâmetros e treina o modelo.

    O GridSearchCV testa todas as combinações de 'parametros' usando validação
    cruzada (cv=5) e fica com a melhor. Devolve o modelo já treinado e pronto
    para fazer previsões.
    """
    busca = GridSearchCV(
        estimator=estimador,
        param_grid=parametros,
        cv=cv,
        scoring="accuracy",
        n_jobs=-1,   # usa todos os núcleos do processador (mais rápido)
        verbose=1,
    )
    busca.fit(X_treino, y_treino)

    print(f"  Melhores parâmetros: {busca.best_params_}")
    print(f"  Acurácia na validação: {busca.best_score_:.4f}")

    return busca.best_estimator_
