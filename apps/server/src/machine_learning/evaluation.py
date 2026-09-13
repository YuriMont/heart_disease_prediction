import matplotlib.pyplot as plt
import numpy as np
from sklearn.metrics import (
    ConfusionMatrixDisplay,
    accuracy_score,
    auc,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_curve,
)


def evaluate(y_true, y_pred, y_probability=None, name="Model"):
    print(f"\n--- Evaluation: {name} ---")
    print(classification_report(y_true, y_pred))

    cm = confusion_matrix(y_true, y_pred, labels=[0, 1])
    tn, fp, fn, tp = map(int, cm.ravel())

    metrics = {
        "accuracy": float(accuracy_score(y_true, y_pred)),
        "recall": float(recall_score(y_true, y_pred)),
        "precision": float(precision_score(y_true, y_pred)),
        "f1_score": float(f1_score(y_true, y_pred)),
        "confusion_matrix": {"tn": tn, "fp": fp, "fn": fn, "tp": tp},
    }

    if y_probability is not None:
        fpr, tpr, _ = roc_curve(y_true, y_probability)
        metrics["auc_roc"] = float(auc(fpr, tpr))
        if len(fpr) > 30:
            indices = np.linspace(0, len(fpr) - 1, 30, dtype=int)
            fpr_sampled = fpr[indices]
            tpr_sampled = tpr[indices]
        else:
            fpr_sampled = fpr
            tpr_sampled = tpr
        metrics["roc_curve"] = [
            {"fpr": round(float(f), 4), "tpr": round(float(t), 4)}
            for f, t in zip(fpr_sampled, tpr_sampled, strict=False)
        ]
    else:
        metrics["auc_roc"] = 0.0
        metrics["roc_curve"] = None

    for name_metric, value in metrics.items():
        if isinstance(value, float):
            print(f"  {name_metric:10s}: {value:.4f}")
        else:
            print(f"  {name_metric:10s}: {value}")

    return metrics


def plot_confusion_matrix(y_true, y_pred, title="Confusion Matrix"):
    labels = sorted(set(y_true))
    matrix = confusion_matrix(y_true, y_pred, labels=labels)
    ConfusionMatrixDisplay(matrix, display_labels=labels).plot()
    plt.title(title)
    plt.show()


def plot_roc_curve(y_true, y_probability, title="ROC Curve"):
    fpr, tpr, _ = roc_curve(y_true, y_probability)
    area = auc(fpr, tpr)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC (AUC = {area:.2f})")
    plt.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Random")
    plt.xlabel("False Positive Rate")
    plt.ylabel("True Positive Rate")
    plt.title(title)
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.show()

    return area
