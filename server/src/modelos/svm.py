"""SVM classifier for heart disease prediction."""

from __future__ import annotations

from typing import Any

from sklearn.svm import SVC

from .base import BaseModel


class SVMModel(BaseModel):
    @property
    def name(self) -> str:
        return "SVM"

    @property
    def estimator(self) -> Any:
        return SVC(probability=True, random_state=42)

    @property
    def param_grid(self) -> dict[str, Any]:
        return {
            "C": [0.1, 1, 10, 100],
            "kernel": ["linear", "rbf"],
            "gamma": ["scale", "auto"],
        }
