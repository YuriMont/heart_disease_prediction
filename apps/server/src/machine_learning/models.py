from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC


def _create_ensemble():
    estimators = [
        ("knn", KNeighborsClassifier(n_neighbors=5)),
        ("svm", SVC(probability=True, random_state=42)),
        ("rf", RandomForestClassifier(n_estimators=200, random_state=42)),
    ]
    return VotingClassifier(estimators=estimators, voting="soft")


MODELS = [
    {
        "name": "knn",
        "estimator": KNeighborsClassifier(),
        "params": {
            "n_neighbors": [3, 5, 7, 9, 11, 13, 15],
            "weights": ["uniform", "distance"],
            "metric": ["euclidean", "manhattan"],
        },
    },
    {
        "name": "svm",
        "estimator": SVC(probability=True, random_state=42),
        "params": {
            "C": [0.1, 1, 10, 100],
            "kernel": ["linear", "rbf"],
            "gamma": ["scale", "auto"],
        },
    },
    {
        "name": "random_forest",
        "estimator": RandomForestClassifier(random_state=42),
        "params": {
            "n_estimators": [100, 200, 300],
            "max_features": ["sqrt", "log2"],
            "max_depth": [4, 6, 8, None],
            "criterion": ["gini", "entropy"],
        },
    },
    {
        "name": "ensemble",
        "estimator": _create_ensemble(),
        "params": {},
    },
]


def train_model(estimator, params, X_train, y_train, cv=5):
    search = GridSearchCV(
        estimator=estimator,
        param_grid=params,
        cv=cv,
        scoring="accuracy",
        n_jobs=-1,
        verbose=1,
    )
    search.fit(X_train, y_train)

    print(f"  Best params: {search.best_params_}")
    print(f"  Validation accuracy: {search.best_score_:.4f}")

    return search.best_estimator_
