import os
from datetime import datetime

import joblib
import shap
import numpy as np

from database.connection import SessionLocal, create_tables
from machine_learning.evaluation import evaluate
from machine_learning.data import prepare_data
from machine_learning.models import MODELS, train_model
from database.models.model import Model

ARTIFACTS_DIR = os.path.join(os.path.dirname(__file__), "..", "artifacts")

DEFAULT_DESCRIPTIONS = {
    "ensemble": "Voting ensemble of 3 models",
    "random_forest": "Random forest",
    "svm": "Support vector machine",
    "knn": "K-nearest neighbors",
}


def main():
    os.makedirs(ARTIFACTS_DIR, exist_ok=True)

    create_tables()

    print("1) Preparing data...")
    data = prepare_data()
    print(f"   Train: {data.X_train.shape} | Test: {data.X_test.shape}")

    joblib.dump(data.scaler, os.path.join(ARTIFACTS_DIR, "scaler.pkl"))
    joblib.dump(
        data.X_train.columns.tolist(),
        os.path.join(ARTIFACTS_DIR, "feature_names.pkl"),
    )
    background_summary = shap.kmeans(data.X_train, 50)
    joblib.dump(background_summary, os.path.join(ARTIFACTS_DIR, "training_background.pkl"))
    print("   Saved: scaler.pkl, feature_names.pkl, and training_background.pkl")

    print("\n2) Training models...")
    db = SessionLocal()

    try:
        for model_config in MODELS:
            print(f"\n>>> Model: {model_config['name']}")

            trained = train_model(
                model_config["estimator"],
                model_config["params"],
                data.X_train,
                data.y_train,
            )

            y_pred = trained.predict(data.X_test)

            if hasattr(trained, "predict_proba"):
                y_probability = trained.predict_proba(data.X_test)[:, 1]
            else:
                y_probability = None

            metrics = evaluate(data.y_test, y_pred, y_probability, name=model_config["name"])

            model_db = db.query(Model).filter(Model.name == model_config["name"]).first()

            if model_db:
                model_db.accuracy = metrics["accuracy"]
                model_db.precision = metrics["precision"]
                model_db.recall = metrics["recall"]
                model_db.f1_score = metrics["f1_score"]
                model_db.auc_roc = metrics["auc_roc"]
                model_db.updated_at = datetime.now()
                print(f"   Metrics updated in database for: {model_config['name']}")
            else:
                new_metrics = Model(
                    name=model_config["name"],
                    description=DEFAULT_DESCRIPTIONS.get(model_config["name"], model_config["name"]),
                    active=True,
                    accuracy=metrics["accuracy"],
                    precision=metrics["precision"],
                    recall=metrics["recall"],
                    f1_score=metrics["f1_score"],
                    auc_roc=metrics["auc_roc"],
                )
                db.add(new_metrics)
                print(f"   Metrics saved to database for: {model_config['name']}")

            caminho = os.path.join(ARTIFACTS_DIR, f"{model_config['name']}.pkl")
            joblib.dump(trained, caminho)
            print(f"   Saved: {caminho}")

        db.commit()
        print("\n   All metrics saved to database!")

    except Exception as e:
        db.rollback()
        print(f"\n   Error saving metrics: {e}")
        raise
    finally:
        db.close()

    print("\nDone! All models trained and saved in 'artifacts/'.")


if __name__ == "__main__":
    main()
