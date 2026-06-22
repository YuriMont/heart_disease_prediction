"""Random Forest classifier for heart disease prediction."""

from __future__ import annotations

from typing import Any

from sklearn.ensemble import RandomForestClassifier

from .base import BaseModel


class RandomForestModel(BaseModel):
    @property
    def name(self) -> str:
        return "Random Forest"

    @property
    def estimator(self) -> Any:
        return RandomForestClassifier(random_state=42)

    @property
    def param_grid(self) -> dict[str, Any]:
        return {
            "n_estimators": [100, 200, 300],
            "max_features": ["sqrt", "log2"],
            "max_depth": [4, 6, 8, None],
            "criterion": ["gini", "entropy"],
        }
