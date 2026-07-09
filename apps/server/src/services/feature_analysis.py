from schemas.result import ContributingFactor, FeatureImportance
from services.prediction_service import MODELOS, FEATURE_NAMES, SCALER, EXPLAINERS
from database.models.evaluation import Evaluation
from machine_learning.data import CATEGORICAL_COLUMNS, CONTINUOUS_COLUMNS
import numpy as np

_ORIGINAL_FEATURES = CONTINUOUS_COLUMNS + CATEGORICAL_COLUMNS


def _build_feature_map():
    feature_map = {}
    for col in FEATURE_NAMES:
        for orig in _ORIGINAL_FEATURES:
            if col == orig or col.startswith(orig + "_"):
                feature_map.setdefault(orig, []).append(col)
                break
        else:
            feature_map.setdefault(col, []).append(col)
    return feature_map


_FEATURE_MAP = _build_feature_map()

_DISPLAY_NAMES = {
    "age": "Age",
    "sex": "Sex",
    "cp": "Chest pain type",
    "trestbps": "Resting blood pressure",
    "chol": "Cholesterol",
    "fbs": "Fasting blood sugar",
    "restecg": "Resting ECG",
    "thalach": "Max heart rate",
    "exang": "Exercise angina",
    "oldpeak": "ST depression",
    "slope": "ST slope",
    "ca": "Colored vessels",
    "thal": "Thalassemia",
}


def _get_model_importance(model_name: str):
    if model_name not in MODELOS:
        return {}, {}

    model = MODELOS[model_name]

    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        explainer = EXPLAINERS.get(model_name)
        if explainer:
            importances = _shap_importance(explainer)
        else:
            return {}, {}

    grouped = {}
    for nome_orig, cols_onehot in _FEATURE_MAP.items():
        total = sum(
            importances[FEATURE_NAMES.index(c)]
            for c in cols_onehot
            if c in FEATURE_NAMES
        )
        grouped[nome_orig] = round(total, 4)

    per_onehot = {name: round(importances[i], 4) for i, name in enumerate(FEATURE_NAMES)}

    return grouped, per_onehot


def _shap_importance(explainer):
    background = SCALER.transform(np.zeros((1, len(FEATURE_NAMES))))
    shap_values = explainer.shap_values(background)
    if isinstance(shap_values, list):
        shap_values = shap_values[1]
    return np.abs(shap_values).mean(axis=0)


def calculate_feature_importance(model_name: str = "random_forest") -> list[FeatureImportance]:
    grouped_importance, _ = _get_model_importance(model_name)

    return sorted(
        [
            FeatureImportance(variable=_DISPLAY_NAMES.get(k, k), weight=v)
            for k, v in grouped_importance.items()
        ],
        key=lambda x: x.weight,
        reverse=True,
    )


def calculate_contributing_factors(evaluation: Evaluation) -> list[ContributingFactor]:
    model_name = evaluation.model_used if evaluation.model_used in MODELOS else "random_forest"
    grouped_importance, onehot_importance = _get_model_importance(model_name)

    scaler_means = dict(zip(FEATURE_NAMES, SCALER.mean_))
    scaler_stds = dict(zip(FEATURE_NAMES, SCALER.scale_))

    factors: list[ContributingFactor] = []

    _add_continuous_factor(
        factors, "Age", evaluation.age, "years",
        grouped_importance.get("age", 0), scaler_means.get("age", 0),
        scaler_stds.get("age", 1),
    )
    _add_continuous_factor(
        factors, "Resting blood pressure", evaluation.trestbps, "mmHg",
        grouped_importance.get("trestbps", 0), scaler_means.get("trestbps", 0),
        scaler_stds.get("trestbps", 1),
    )
    _add_continuous_factor(
        factors, "Cholesterol", evaluation.chol, "mg/dL",
        grouped_importance.get("chol", 0), scaler_means.get("chol", 0),
        scaler_stds.get("chol", 1),
    )
    _add_continuous_factor(
        factors, "Max heart rate", evaluation.thalach, "bpm",
        grouped_importance.get("thalach", 0), scaler_means.get("thalach", 0),
        scaler_stds.get("thalach", 1),
    )
    _add_continuous_factor(
        factors, "ST depression", evaluation.oldpeak, "mm",
        grouped_importance.get("oldpeak", 0), scaler_means.get("oldpeak", 0),
        scaler_stds.get("oldpeak", 1),
    )

    _add_category_factor(
        factors, "Chest pain type", evaluation.cp,
        {1: "Typical", 2: "Atypical", 3: "Non-anginal", 4: "Asymptomatic"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "ST slope", evaluation.slope,
        {1: "Upsloping", 2: "Flat", 3: "Downsloping"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Thalassemia", evaluation.thal,
        {3: "Normal", 6: "Fixed defect", 7: "Reversible defect"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Colored vessels", evaluation.ca,
        {0: "None", 1: "1 vessel", 2: "2 vessels", 3: "3 vessels"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Sex", evaluation.sex,
        {0: "Female", 1: "Male"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Exercise angina", evaluation.exang,
        {0: "No", 1: "Yes"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Fasting blood sugar", evaluation.fbs,
        {0: "Normal", 1: "High"},
        grouped_importance, onehot_importance,
    )
    _add_category_factor(
        factors, "Resting ECG", evaluation.restecg,
        {0: "Normal", 1: "ST-T abnormality", 2: "LV hypertrophy"},
        grouped_importance, onehot_importance,
    )

    factors.sort(key=lambda f: abs(f.impact), reverse=True)
    return factors


def _add_continuous_factor(
    factors: list[ContributingFactor], name: str, value: float, unit: str,
    importance: float, mean: float, std: float,
):
    if std == 0:
        std = 1
    z_score = (value - mean) / std
    impact = importance * z_score

    factors.append(ContributingFactor(
        variable=name,
        value=f"{int(value)} {unit}",
        impact=round(impact, 2),
    ))


def _add_category_factor(
    factors: list[ContributingFactor], name: str, value: int | float,
    name_map: dict[int | float, str],
    grouped_importance: dict[str, float], onehot_importance: dict[str, float],
):
    label = name_map.get(value, f"Type {value}")
    impact = 0.0

    for onehot_col, imp in onehot_importance.items():
        if onehot_col.startswith(name.lower() + "_"):
            active = False
            try:
                suffix = float(onehot_col.rsplit("_", 1)[1])
                active = abs(value - suffix) < 0.001
            except (ValueError, IndexError):
                active = str(value) == onehot_col.rsplit("_", 1)[-1]
            if active:
                impact += imp

    factors.append(ContributingFactor(
        variable=name,
        value=label,
        impact=round(impact, 2),
    ))