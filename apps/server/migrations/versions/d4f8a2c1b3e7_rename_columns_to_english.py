"""rename columns to english

Revision ID: d4f8a2c1b3e7
Revises: 2fea789095e6
Create Date: 2026-06-29 10:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = 'd4f8a2c1b3e7'
down_revision: Union[str, Sequence[str], None] = '2fea789095e6'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # pacientes table
    op.alter_column('pacientes', 'nome', new_column_name='name')
    op.alter_column('pacientes', 'idade', new_column_name='age')
    op.alter_column('pacientes', 'sexo', new_column_name='sex')
    op.alter_column('pacientes', 'criado_em', new_column_name='created_at')

    # modelos table
    op.alter_column('modelos', 'nome', new_column_name='name')
    op.alter_column('modelos', 'descricao', new_column_name='description')
    op.alter_column('modelos', 'ativo', new_column_name='active')
    op.alter_column('modelos', 'acuracia', new_column_name='accuracy')
    op.alter_column('modelos', 'precisao', new_column_name='precision')
    op.alter_column('modelos', 'criado_em', new_column_name='created_at')
    op.alter_column('modelos', 'atualizado_em', new_column_name='updated_at')

    # avaliacoes table
    op.alter_column('avaliacoes', 'modelo_usado', new_column_name='model_used')
    op.alter_column('avaliacoes', 'tem_doenca', new_column_name='has_disease')
    op.alter_column('avaliacoes', 'probabilidade_doenca', new_column_name='disease_probability')
    op.alter_column('avaliacoes', 'resultado_texto', new_column_name='result_text')
    op.alter_column('avaliacoes', 'criado_em', new_column_name='created_at')

    # relatorios table
    op.alter_column('relatorios', 'titulo', new_column_name='title')
    op.alter_column('relatorios', 'conteudo', new_column_name='content')
    op.alter_column('relatorios', 'criado_em', new_column_name='created_at')

    # Rename unique constraint
    op.drop_constraint('uq_modelo_nome', 'modelos', type_='unique')
    op.create_unique_constraint('uq_model_name', 'modelos', ['name'])


def downgrade() -> None:
    op.alter_column('pacientes', 'name', new_column_name='nome')
    op.alter_column('pacientes', 'age', new_column_name='idade')
    op.alter_column('pacientes', 'sex', new_column_name='sexo')
    op.alter_column('pacientes', 'created_at', new_column_name='criado_em')

    op.alter_column('modelos', 'name', new_column_name='nome')
    op.alter_column('modelos', 'description', new_column_name='descricao')
    op.alter_column('modelos', 'active', new_column_name='ativo')
    op.alter_column('modelos', 'accuracy', new_column_name='acuracia')
    op.alter_column('modelos', 'precision', new_column_name='precisao')
    op.alter_column('modelos', 'created_at', new_column_name='criado_em')
    op.alter_column('modelos', 'updated_at', new_column_name='atualizado_em')

    op.alter_column('avaliacoes', 'model_used', new_column_name='modelo_usado')
    op.alter_column('avaliacoes', 'has_disease', new_column_name='tem_doenca')
    op.alter_column('avaliacoes', 'disease_probability', new_column_name='probabilidade_doenca')
    op.alter_column('avaliacoes', 'result_text', new_column_name='resultado_texto')
    op.alter_column('avaliacoes', 'created_at', new_column_name='criado_em')

    op.alter_column('relatorios', 'title', new_column_name='titulo')
    op.alter_column('relatorios', 'content', new_column_name='conteudo')
    op.alter_column('relatorios', 'created_at', new_column_name='criado_em')

    op.drop_constraint('uq_modelo_nome', 'modelos', type_='unique')
    op.create_unique_constraint('uq_modelo_nome', 'modelos', ['name'])
