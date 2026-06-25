"""Modelos ORM do banco de dados.

Define as tabelas: Paciente, Avaliacao, Relatorio, ModelMetrica.
"""

from database.models.avaliacao import Avaliacao
from database.models.modelo import Modelo
from database.models.paciente import Paciente
from database.models.relatorio import Relatorio

__all__ = ["Avaliacao", "Modelo", "Paciente", "Relatorio"]
