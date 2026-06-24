from enum import Enum


class NomeModelo(str, Enum):
    knn = "knn"
    svm = "svm"
    random_forest = "random_forest"
    ensemble = "ensemble"
