import os

import joblib

from machine_learning.avaliacao import avaliar
from machine_learning.dados import preparar_dados
from machine_learning.modelos import MODELOS, treinar_modelo

# Pasta onde os arquivos .pkl (modelos treinados) serão salvos.
# os.path.dirname(__file__) é a pasta onde este arquivo está (a pasta 'server').
PASTA_ARTEFATOS = os.path.join(os.path.dirname(__file__), "..", "artifacts")


def main():
    # Cria a pasta 'artefatos/' caso ela ainda não exista.
    os.makedirs(PASTA_ARTEFATOS, exist_ok=True)

    print("1) Preparando os dados...")
    dados = preparar_dados()
    print(f"   Treino: {dados.X_treino.shape} | Teste: {dados.X_teste.shape}")

    # Salva o scaler e os nomes das colunas. A API PRECISA destes dois arquivos
    # para transformar os dados de um novo paciente exatamente como foi feito
    # aqui no treino.
    joblib.dump(dados.scaler, os.path.join(PASTA_ARTEFATOS, "scaler.pkl"))
    joblib.dump(
        dados.X_treino.columns.tolist(),
        os.path.join(PASTA_ARTEFATOS, "feature_names.pkl"),
    )
    print("   Salvos: scaler.pkl e feature_names.pkl")

    print("\n2) Treinando os modelos...")
    for modelo in MODELOS:
        print(f"\n>>> Modelo: {modelo['nome']}")

        # Treina e pega o melhor modelo daquele tipo.
        treinado = treinar_modelo(
            modelo["estimador"],
            modelo["parametros"],
            dados.X_treino,
            dados.y_treino,
        )

        # Avalia no conjunto de teste (dados que o modelo nunca viu).
        y_previsto = treinado.predict(dados.X_teste)
        avaliar(dados.y_teste, y_previsto, nome=modelo["nome"])

        # Salva o modelo treinado em um arquivo .pkl.
        caminho = os.path.join(PASTA_ARTEFATOS, f"{modelo['nome']}.pkl")
        joblib.dump(treinado, caminho)
        print(f"   Salvo: {caminho}")

    print("\nPronto! Todos os modelos foram treinados e salvos em 'artefatos/'.")


if __name__ == "__main__":
    main()
