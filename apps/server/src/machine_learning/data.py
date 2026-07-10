import numpy as np
import pandas as pd
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from ucimlrepo import fetch_ucirepo

CONTINUOUS_COLUMNS = ["age", "trestbps", "chol", "thalach", "oldpeak"]

CATEGORICAL_COLUMNS = ["sex", "cp", "fbs", "restecg", "exang", "slope", "ca", "thal"]


class PreparedData:
    def __init__(self, X_train, X_test, y_train, y_test, scaler):
        self.X_train = X_train
        self.X_test = X_test
        self.y_train = y_train
        self.y_test = y_test
        self.scaler = scaler


def load_data():
    dataset = fetch_ucirepo(id=45)
    assert dataset.data is not None, "UCI dataset data is missing"
    assert dataset.data.features is not None, "UCI dataset features are missing"
    assert dataset.data.targets is not None, "UCI dataset targets are missing"
    X = dataset.data.features.copy()
    y = dataset.data.targets.copy()
    return X, y


def fill_missing(X):
    X = X.copy()
    X["ca"] = X["ca"].fillna(X["ca"].median())
    X["thal"] = X["thal"].fillna(X["thal"].median())
    return X


def limit_outliers(X, columns=None):
    columns = columns or CONTINUOUS_COLUMNS
    X = X.copy()
    for col in columns:
        q1 = X[col].quantile(0.25)
        q3 = X[col].quantile(0.75)
        iqr = q3 - q1
        lower = q1 - 1.5 * iqr
        upper = q3 + 1.5 * iqr
        X[col] = np.where(X[col] < lower, lower, X[col])
        X[col] = np.where(X[col] > upper, upper, X[col])
    return X


def encode_categorical(X):
    return pd.get_dummies(X, columns=CATEGORICAL_COLUMNS, drop_first=True)


def scale(X_train, X_test):
    scaler = StandardScaler()
    columns = X_train.columns

    X_train_scaled = pd.DataFrame(scaler.fit_transform(X_train), columns=columns)
    X_test_scaled = pd.DataFrame(scaler.transform(X_test), columns=columns)

    return X_train_scaled, X_test_scaled, scaler


def binarize_target(y):
    return y["num"].apply(lambda v: 1 if v > 0 else 0)


def balance_smote(X_train, y_train, random_state=42):
    smote = SMOTE(random_state=random_state)
    X_bal, y_bal = smote.fit_resample(X_train, y_train)  # type: ignore[assignment]
    return X_bal, y_bal


def prepare_data(test_size=0.2, random_state=42, balance=True):
    X, y = load_data()

    X = fill_missing(X)
    X = limit_outliers(X)
    y = binarize_target(y)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    X_train = encode_categorical(X_train)
    X_test = encode_categorical(X_test)

    X_test = X_test.reindex(columns=X_train.columns, fill_value=0)

    X_train, X_test, scaler = scale(X_train, X_test)

    if balance:
        X_train, y_train = balance_smote(X_train, y_train, random_state)

    return PreparedData(X_train, X_test, y_train, y_test, scaler)
