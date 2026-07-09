import shap

import numpy as np

from schemas.result import ContributingFactor, FeatureImportance
from services.constants import get_display_name, get_unit, get_categories, get_continuous_keys, get_categorical_keys
from services.prediction_service import MODELOS, FEATURE_NAMES, SCALER, TRAINING_BACKGROUND
from database.models.evaluation import Evaluation
from machine_learning.data import CATEGORICAL_COLUMNS, CONTINUOUS_COLUMNS

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


def _get_model_importance(model_name: str):
    if model_name not in MODELOS:
        return {}, {}

    model = MODELOS[model_name]

    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
    else:
        try:
            explainer = shap.KernelExplainer(model.predict_proba, TRAINING_BACKGROUND, link="identity")
            importances = _shap_importance(explainer)
        except Exception:
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
    if shap_values.ndim == 3:
        shap_values = shap_values[:, :, 1]
    return np.abs(shap_values).mean(axis=0)


def calculate_feature_importance(model_name: str = "random_forest") -> list[FeatureImportance]:
    grouped_importance, _ = _get_model_importance(model_name)

    return sorted(
        [
            FeatureImportance(variable=get_display_name(k) or k, weight=v)
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

    for key in get_continuous_keys():
        _add_continuous_factor(
            factors, get_display_name(key) or key, getattr(evaluation, key),
            get_unit(key) or "",
            grouped_importance.get(key, 0), scaler_means.get(key, 0),
            scaler_stds.get(key, 1),
        )

    for key in get_categorical_keys():
        _add_category_factor(
            factors, get_display_name(key) or key, getattr(evaluation, key),
            get_categories(key) or {},
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