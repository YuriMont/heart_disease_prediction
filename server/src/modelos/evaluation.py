"""Model evaluation: metrics, confusion matrix, ROC curve."""

from __future__ import annotations

from dataclasses import dataclass

import matplotlib.pyplot as plt
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    auc,
    classification_report,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_curve,
    ConfusionMatrixDisplay,
)


@dataclass
class Metrics:
    accuracy: float
    recall: float
    precision: float
    f1: float


def compute_metrics(y_true: pd.Series, y_pred: pd.Series) -> Metrics:
    return Metrics(
        accuracy=accuracy_score(y_true, y_pred),
        recall=recall_score(y_true, y_pred),
        precision=precision_score(y_true, y_pred),
        f1=f1_score(y_true, y_pred),
    )


def print_classification_report(y_true: pd.Series, y_pred: pd.Series) -> None:
    print(classification_report(y_true, y_pred))


def plot_confusion_matrix(y_true: pd.Series, y_pred: pd.Series, labels: list, title: str = "Matriz de Confusão") -> None:
    cm = confusion_matrix(y_true, y_pred, labels=labels)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=labels)
    disp.plot(cmap=plt.cm.Blues)
    plt.title(title)
    plt.show()


def plot_roc_curve(y_true: pd.Series, y_pred_proba: pd.Series, title: str = "Curva ROC") -> float:
    fpr, tpr, _ = roc_curve(y_true, y_pred_proba)
    roc_auc = auc(fpr, tpr)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"Curva ROC (AUC = {roc_auc:.2f})")
    plt.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Classificador Aleatório")
    plt.xlim([0.0, 1.0])
    plt.ylim([0.0, 1.05])
    plt.xlabel("Taxa de Falsos Positivos (FPR)")
    plt.ylabel("Taxa de Verdadeiros Positivos (TPR)")
    plt.title(title)
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.show()

    return roc_auc


def full_evaluation(
    y_true: pd.Series,
    y_pred: pd.Series,
    y_pred_proba: pd.Series | None = None,
    model_name: str = "Modelo",
) -> Metrics:
    print(f"\n--- Avaliação: {model_name} ---\n")
    print_classification_report(y_true, y_pred)

    metrics = compute_metrics(y_true, y_pred)
    print(f"Acurácia:  {metrics.accuracy:.4f}")
    print(f"Recall:    {metrics.recall:.4f}")
    print(f"Precision: {metrics.precision:.4f}")
    print(f"F1-Score:  {metrics.f1:.4f}")

    labels = sorted(y_true.unique())
    plot_confusion_matrix(y_true, y_pred, labels=labels, title=f"Matriz de Confusão - {model_name}")

    if y_pred_proba is not None:
        auc_score = plot_roc_curve(y_true, y_pred_proba, title=f"Curva ROC - {model_name}")
        print(f"AUC:       {auc_score:.4f}")

    return metrics
