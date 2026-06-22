"""Base class for heart disease prediction models."""

from __future__ import annotations

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import Any

import pandas as pd
from sklearn.model_selection import GridSearchCV


@dataclass
class ModelResult:
    best_params: dict[str, Any]
    best_score: float
    y_pred: pd.Series | None = None
    y_pred_proba: pd.Series | None = None
    grid_search: GridSearchCV | None = field(default=None, repr=False)


class BaseModel(ABC):
    @property
    @abstractmethod
    def name(self) -> str: ...

    @property
    @abstractmethod
    def estimator(self) -> Any: ...

    @property
    @abstractmethod
    def param_grid(self) -> dict[str, Any]: ...

    def fit(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        cv: int = 5,
        scoring: str = "accuracy",
        n_jobs: int = -1,
    ) -> ModelResult:
        gs = GridSearchCV(
            estimator=self.estimator,
            param_grid=self.param_grid,
            cv=cv,
            scoring=scoring,
            n_jobs=n_jobs,
            verbose=1,
        )
        gs.fit(X_train, y_train)

        return ModelResult(
            best_params=gs.best_params_,
            best_score=gs.best_score_,
            grid_search=gs,
        )

    def predict(self, result: ModelResult, X_test: pd.DataFrame) -> pd.Series:
        return result.grid_search.best_estimator_.predict(X_test)

    def predict_proba(self, result: ModelResult, X_test: pd.DataFrame) -> pd.Series:
        estimator = result.grid_search.best_estimator_
        return estimator.predict_proba(X_test)[:, 1]
