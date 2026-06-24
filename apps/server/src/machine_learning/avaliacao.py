import matplotlib.pyplot as plt
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


def avaliar(y_verdadeiro, y_previsto, y_probabilidade=None, nome="Modelo"):
    """Calcula e imprime as principais métricas. Devolve um dicionário com elas."""
    print(f"\n--- Avaliação: {nome} ---")
    print(classification_report(y_verdadeiro, y_previsto))

    metricas = {
        "acuracia": float(accuracy_score(y_verdadeiro, y_previsto)),
        "recall": float(recall_score(y_verdadeiro, y_previsto)),
        "precisao": float(precision_score(y_verdadeiro, y_previsto)),
        "f1_score": float(f1_score(y_verdadeiro, y_previsto)),
    }

    if y_probabilidade is not None:
        fpr, tpr, _ = roc_curve(y_verdadeiro, y_probabilidade)
        metricas["auc_roc"] = float(auc(fpr, tpr))
    else:
        metricas["auc_roc"] = 0.0

    for nome_metrica, valor in metricas.items():
        print(f"  {nome_metrica:10s}: {valor:.4f}")

    return metricas


def plotar_matriz_confusao(y_verdadeiro, y_previsto, titulo="Matriz de Confusão"):
    """Mostra um quadro com acertos e erros do modelo (útil nos notebooks)."""
    rotulos = sorted(set(y_verdadeiro))
    matriz = confusion_matrix(y_verdadeiro, y_previsto, labels=rotulos)
    ConfusionMatrixDisplay(matriz, display_labels=rotulos).plot(cmap=plt.cm.Blues)
    plt.title(titulo)
    plt.show()


def plotar_curva_roc(y_verdadeiro, y_probabilidade, titulo="Curva ROC"):
    """Desenha a curva ROC e devolve a área (AUC). Quanto mais perto de 1, melhor."""
    fpr, tpr, _ = roc_curve(y_verdadeiro, y_probabilidade)
    area = auc(fpr, tpr)

    plt.figure(figsize=(8, 6))
    plt.plot(fpr, tpr, color="darkorange", lw=2, label=f"ROC (AUC = {area:.2f})")
    plt.plot([0, 1], [0, 1], color="navy", lw=2, linestyle="--", label="Aleatório")
    plt.xlabel("Taxa de Falsos Positivos")
    plt.ylabel("Taxa de Verdadeiros Positivos")
    plt.title(titulo)
    plt.legend(loc="lower right")
    plt.grid(True)
    plt.show()

    return area
