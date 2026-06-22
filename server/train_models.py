"""Train all models and save as .pkl artifacts."""

import joblib
import os

from modelos.preprocessing import prepare_dataset
from modelos.knn import KNNModel
from modelos.svm import SVMModel
from modelos.random_forest import RandomForestModel
from modelos.ensemble import EnsembleModel
from modelos.evaluation import full_evaluation

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "src", "app", "artifacts")


def train_and_save(model_cls, ds, artifacts_dir: str):
    model = model_cls()
    print(f"\n{'='*60}")
    print(f"Training: {model.name}")
    print(f"{'='*60}")

    result = model.fit(ds.X_train, ds.y_train)
    y_pred = model.predict(result, ds.X_test)
    y_proba = model.predict_proba(result, ds.X_test)

    full_evaluation(ds.y_test, y_pred, y_proba, model_name=model.name)

    filepath = os.path.join(artifacts_dir, f"{model.name.lower().replace(' ', '_')}.pkl")
    joblib.dump(result.grid_search.best_estimator_, filepath)
    print(f"Saved: {filepath}")

    return model.name, result


def main():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    print("Preparing dataset...")
    ds = prepare_dataset()
    print(f"X_train: {ds.X_train.shape}, X_test: {ds.X_test.shape}")

    # Save scaler and feature names for API inference
    joblib.dump(ds.X_train.columns.tolist(), os.path.join(ARTIFACTS_DIR, "feature_names.pkl"))
    print(f"Saved: feature_names.pkl")

    models = [KNNModel, SVMModel, RandomForestModel, EnsembleModel]
    results = {}

    for model_cls in models:
        name, result = train_and_save(model_cls, ds, ARTIFACTS_DIR)
        results[name] = result.best_params

    print(f"\n{'='*60}")
    print("All models trained and saved.")
    print(f"{'='*60}")
    for name, params in results.items():
        print(f"  {name}: {params}")


if __name__ == "__main__":
    main()
