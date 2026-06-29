from services.prediction_service import MODELOS, FEATURE_NAMES, SCALER

_FEATURE_MAP = {
    "age": ["age"],
    "sex": ["sex_1"],
    "cp": ["cp_2", "cp_3", "cp_4"],
    "trestbps": ["trestbps"],
    "chol": ["chol"],
    "fbs": ["fbs_1"],
    "restecg": ["restecg_1", "restecg_2"],
    "thalach": ["thalach"],
    "exang": ["exang_1"],
    "oldpeak": ["oldpeak"],
    "slope": ["slope_2", "slope_3"],
    "ca": ["ca_1.0", "ca_2.0", "ca_3.0"],
    "thal": ["thal_6.0", "thal_7.0"],
}

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

_CATEGORY_DIRECTIONS = {
    "sex_1": 1,
    "cp_2": -0.5,
    "cp_3": -0.3,
    "cp_4": -0.8,
    "fbs_1": 0.3,
    "restecg_1": 0.2,
    "restecg_2": 0.5,
    "exang_1": 0.7,
    "slope_2": 0.3,
    "slope_3": 0.7,
    "ca_1.0": 0.6,
    "ca_2.0": 0.8,
    "ca_3.0": 1.0,
    "thal_6.0": 0.5,
    "thal_7.0": 0.9,
}


def _get_rf_importance():
    if "random_forest" not in MODELOS:
        return {}, {}

    rf = MODELOS["random_forest"]
    importancias = rf.feature_importances_

    grouped = {}
    for nome_orig, cols_onehot in _FEATURE_MAP.items():
        total = sum(
            importancias[FEATURE_NAMES.index(c)]
            for c in cols_onehot
            if c in FEATURE_NAMES
        )
        grouped[nome_orig] = round(total, 4)

    per_onehot = {name: round(importancias[i], 4) for i, name in enumerate(FEATURE_NAMES)}

    return grouped, per_onehot


def calculate_feature_importance():
    grouped_importance, _ = _get_rf_importance()

    return sorted(
        [
            {"variable": _DISPLAY_NAMES[k], "weight": v}
            for k, v in grouped_importance.items()
        ],
        key=lambda x: x["weight"],
        reverse=True,
    )


def calculate_contributing_factors(evaluation) -> list[dict]:
    grouped_importance, onehot_importance = _get_rf_importance()

    scaler_means = dict(zip(FEATURE_NAMES, SCALER.mean_))
    scaler_stds = dict(zip(FEATURE_NAMES, SCALER.scale_))

    factors = []

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
        factors, "Age", evaluation.age, "years",
        grouped_importance.get("age", 0), scaler_means.get("age", 0),
        scaler_stds.get("age", 1),
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
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "ST slope", evaluation.slope,
        {1: "Upsloping", 2: "Flat", 3: "Downsloping"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Thalassemia", evaluation.thal,
        {3: "Normal", 6: "Fixed defect", 7: "Reversible defect"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Colored vessels", evaluation.ca,
        {0: "None", 1: "1 vessel", 2: "2 vessels", 3: "3 vessels"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Sex", evaluation.sex,
        {0: "Female", 1: "Male"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Exercise angina", evaluation.exang,
        {0: "No", 1: "Yes"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Fasting blood sugar", evaluation.fbs,
        {0: "Normal", 1: "High"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )
    _add_category_factor(
        factors, "Resting ECG", evaluation.restecg,
        {0: "Normal", 1: "ST-T abnormality", 2: "LV hypertrophy"},
        onehot_importance, _CATEGORY_DIRECTIONS,
    )

    factors.sort(key=lambda f: abs(f["impact"]), reverse=True)
    return factors


def _add_continuous_factor(factors, name, value, unit, importance, mean, std):
    if std == 0:
        std = 1
    z_score = (value - mean) / std
    impact = importance * z_score

    factors.append({
        "variable": name,
        "value": f"{int(value)} {unit}",
        "impact": round(impact, 2),
    })


def _add_category_factor(factors, name, value, name_map, rf_importance, directions):
    onehot_column = _find_onehot(name, value, rf_importance)

    if onehot_column and onehot_column in rf_importance:
        importance_col = rf_importance[onehot_column]
        direction = directions.get(onehot_column, 0)
        impact = importance_col * direction
    else:
        impact = 0

    factors.append({
        "variable": name,
        "value": name_map.get(value, f"Type {value}"),
        "impact": round(impact, 2),
    })


def _find_onehot(feature_name, value, rf_importance):
    mapping = {
        "Chest pain type": {2: "cp_2", 3: "cp_3", 4: "cp_4"},
        "ST slope": {2: "slope_2", 3: "slope_3"},
        "Thalassemia": {6: "thal_6.0", 7: "thal_7.0"},
        "Colored vessels": {1: "ca_1.0", 2: "ca_2.0", 3: "ca_3.0"},
        "Sex": {1: "sex_1"},
        "Exercise angina": {1: "exang_1"},
        "Fasting blood sugar": {1: "fbs_1"},
        "Resting ECG": {1: "restecg_1", 2: "restecg_2"},
    }
    return mapping.get(feature_name, {}).get(value)
