"""Modelos ORM do banco de dados.

Define as tabelas: Paciente, Avaliacao, Relatorio, ModelMetrica.
"""

from models.avaliacao import Avaliacao
from models.metrica import ModelMetrica
from models.paciente import Paciente
from models.relatorio import Relatorio

__all__ = ["Avaliacao", "ModelMetrica", "Paciente", "Relatorio"]
