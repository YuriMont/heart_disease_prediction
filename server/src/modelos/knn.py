"""KNN classifier for heart disease prediction."""

from __future__ import annotations

from typing import Any

from sklearn.neighbors import KNeighborsClassifier

from .base import BaseModel


class KNNModel(BaseModel):
    @property
    def name(self) -> str:
        return "KNN"

    @property
    def estimator(self) -> Any:
        return KNeighborsClassifier()

    @property
    def param_grid(self) -> dict[str, Any]:
        return {
            "n_neighbors": [3, 5, 7, 9, 11, 13, 15],
            "weights": ["uniform", "distance"],
            "metric": ["euclidean", "manhattan"],
        }
