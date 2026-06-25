import os
from datetime import datetime

import joblib

from database.connection import SessionLocal, criar_tabelas
from machine_learning.avaliacao import avaliar
from machine_learning.dados import preparar_dados
from machine_learning.modelos import MODELOS, treinar_modelo
from database.models.modelo import Modelo

# Pasta onde os arquivos .pkl (modelos treinados) serão salvos.
# os.path.dirname(__file__) é a pasta onde este arquivo está (a pasta 'server').
PASTA_ARTEFATOS = os.path.join(os.path.dirname(__file__), "..", "artifacts")

DESCRICOES_PADRAO = {
    "ensemble": "Votação dos 3 modelos",
    "random_forest": "Floresta aleatória",
    "svm": "Vetores de suporte",
    "knn": "K-vizinhos mais próximos",
}


def main():
    # Cria a pasta 'artefatos/' caso ela ainda não exista.
    os.makedirs(PASTA_ARTEFATOS, exist_ok=True)

    # Garante que a tabela de métricas existe
    criar_tabelas()

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
    db = SessionLocal()

    try:
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

            # Pega probabilidades para calcular AUC-ROC
            if hasattr(treinado, "predict_proba"):
                y_probabilidade = treinado.predict_proba(dados.X_teste)[:, 1]
            else:
                y_probabilidade = None

            metricas = avaliar(dados.y_teste, y_previsto, y_probabilidade, nome=modelo["nome"])

            # Salva ou atualiza as métricas no banco de dados
            modelo_db = db.query(Modelo).filter(Modelo.id == modelo["nome"]).first()

            if modelo_db:
                modelo_db.acuracia = metricas["acuracia"]
                modelo_db.precisao = metricas["precisao"]
                modelo_db.recall = metricas["recall"]
                modelo_db.f1_score = metricas["f1_score"]
                modelo_db.auc_roc = metricas["auc_roc"]
                modelo_db.atualizado_em = datetime.now()
                print(f"   Métricas atualizadas no banco para: {modelo['nome']}")
            else:
                nova_metrica = Modelo(
                    nome=modelo["nome"],
                    descricao=DESCRICOES_PADRAO.get(modelo["nome"], modelo["nome"]),
                    ativo=True,
                    acuracia=metricas["acuracia"],
                    precisao=metricas["precisao"],
                    recall=metricas["recall"],
                    f1_score=metricas["f1_score"],
                    auc_roc=metricas["auc_roc"],
                )
                db.add(nova_metrica)
                print(f"   Métricas salvas no banco para: {modelo['nome']}")

            # Salva o modelo treinado em um arquivo .pkl.
            caminho = os.path.join(PASTA_ARTEFATOS, f"{modelo['nome']}.pkl")
            joblib.dump(treinado, caminho)
            print(f"   Salvo: {caminho}")

        # Confirma todas as alterações no banco
        db.commit()
        print("\n   Todas as métricas foram salvas no banco de dados!")

    except Exception as e:
        db.rollback()
        print(f"\n   Erro ao salvar métricas: {e}")
        raise
    finally:
        db.close()

    print("\nPronto! Todos os modelos foram treinados e salvos em 'artefatos/'.")


if __name__ == "__main__":
    main()
