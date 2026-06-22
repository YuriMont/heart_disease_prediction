"""Data loading, cleaning, and preprocessing for UCI Heart Disease dataset."""

from __future__ import annotations

from dataclasses import dataclass

import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from ucimlrepo import fetch_ucirepo


CONTINUOUS_COLS = ["age", "trestbps", "chol", "thalach", "oldpeak"]
CATEGORICAL_COLS = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]


@dataclass
class DatasetSplit:
    X_train: pd.DataFrame
    X_test: pd.DataFrame
    y_train: pd.Series
    y_test: pd.Series


def load_uci_heart_disease() -> tuple[pd.DataFrame, pd.Series]:
    heart_disease = fetch_ucirepo(id=45)
    X = heart_disease.data.features.copy()
    y = heart_disease.data.targets.copy()
    return X, y


def impute_missing(X: pd.DataFrame) -> pd.DataFrame:
    X = X.copy()
    X["ca"] = X["ca"].fillna(X["ca"].median())
    X["thal"] = X["thal"].fillna(X["thal"].median())
    return X


def cap_outliers_iqr(X: pd.DataFrame, cols: list[str] | None = None) -> pd.DataFrame:
    cols = cols or CONTINUOUS_COLS
    X = X.copy()
    for col in cols:
        q1 = X[col].quantile(0.25)
        q3 = X[col].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        X[col] = np.where(X[col] < lower, lower, X[col])
        X[col] = np.where(X[col] > upper, upper, X[col])
    return X


def encode_categoricals(X: pd.DataFrame) -> pd.DataFrame:
    return pd.get_dummies(X, columns=CATEGORICAL_COLS, drop_first=True)


def scale_features(X_train: pd.DataFrame, X_test: pd.DataFrame) -> tuple[pd.DataFrame, pd.DataFrame, StandardScaler]:
    scaler = StandardScaler()
    cols = X_train.columns

    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=cols)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=cols)

    return X_train_scaled, X_test_scaled, scaler


def binarize_target(y: pd.Series) -> pd.Series:
    return y["num"].apply(lambda x: 1 if x > 0 else 0)


def apply_smote(X_train: pd.DataFrame, y_train: pd.Series, random_state: int = 42) -> tuple[pd.DataFrame, pd.Series]:
    smote = SMOTE(random_state=random_state)
    X_res, y_res = smote.fit_resample(X_train, y_train)
    return X_res, y_res


def prepare_dataset(
    test_size: float = 0.2,
    random_state: int = 42,
    apply_balancing: bool = True,
) -> DatasetSplit:
    X, y = load_uci_heart_disease()

    X = impute_missing(X)
    X = cap_outliers_iqr(X)
    y_bin = binarize_target(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y_bin, test_size=test_size, random_state=random_state, stratify=y_bin
    )

    X_train = encode_categoricals(X_train)
    X_test = encode_categoricals(X_test)

    X_train, X_test, scaler = scale_features(X_train, X_test)

    if apply_balancing:
        X_train, y_train = apply_smote(X_train, y_train, random_state=random_state)

    return DatasetSplit(X_train=X_train, X_test=X_test, y_train=y_train, y_test=y_test)
