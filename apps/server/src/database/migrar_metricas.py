"""Migração: adiciona colunas 'descricao' e 'ativo' à tabela model_metricas."""

import os
import sqlite3

CAMINHO_BANCO = os.path.join(os.path.dirname(__file__), "cardiopredict.db")


def migrar():
    conn = sqlite3.connect(CAMINHO_BANCO)
    cursor = conn.cursor()

    colunas_existentes = {row[1] for row in cursor.execute("PRAGMA table_info(model_metricas)").fetchall()}

    if "descricao" not in colunas_existentes:
        cursor.execute("ALTER TABLE model_metricas ADD COLUMN descricao VARCHAR(255)")
        print("  Coluna 'descricao' adicionada.")

    if "ativo" not in colunas_existentes:
        cursor.execute("ALTER TABLE model_metricas ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT 1")
        print("  Coluna 'ativo' adicionada.")

    conn.commit()
    conn.close()
    print("Migração concluída!")


if __name__ == "__main__":
    migrar()
