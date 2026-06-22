"""Ensemble voting classifier combining KNN, SVM, and Random Forest."""

from __future__ import annotations

from typing import Any

from sklearn.ensemble import RandomForestClassifier, VotingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC

from .base import BaseModel


class EnsembleModel(BaseModel):
    @property
    def name(self) -> str:
        return "Ensemble"

    @property
    def estimator(self) -> Any:
        estimators = [
            ("knn", KNeighborsClassifier(n_neighbors=5)),
            ("svm", SVC(probability=True, random_state=42)),
            ("rf", RandomForestClassifier(n_estimators=200, random_state=42)),
        ]
        return VotingClassifier(estimators=estimators, voting="soft")

    @property
    def param_grid(self) -> dict[str, Any]:
        return {}
