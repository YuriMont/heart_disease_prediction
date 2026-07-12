from database.models.evaluation import Evaluation
from schemas.result import ContributingFactor
from services.constants import _config

_DISPLAY_TO_KEY = {v.display_name: k for k, v in _config.features.items()}


def generate_recommendations(
    evaluation: Evaluation,
    factors: list[ContributingFactor],
) -> list[str]:
    recs: list[str] = []
    prob = evaluation.disease_probability

    # --- Recomendações baseadas no nível de risco ---
    # Quanto maior a probabilidade, mais urgente o tom.
    # HIGH → urgência de atendimento especializado
    # MEDIUM → acompanhamento programado
    # LOW → manutenção preventiva
    if prob >= 0.65:
        recs.append("Buscar atendimento médico especializado com urgência para avaliação cardiológica completa")
    elif prob >= 0.35:
        recs.append("Agendar consulta com cardiologista para acompanhamento e exames complementares")
    else:
        recs.append("Manter acompanhamento cardiológico regular com exames periódicos de rotina")

    # --- Recomendações baseadas em fatores contribuintes ---
    # Cada variável clínica com alto impacto gera recomendação específica.
    # A lógica verifica tanto o fator contribuinte quanto o valor real
    # na evaluation para garantir que a recomendação é relevante.
    factor_vars: dict[str, ContributingFactor] = {}
    for f in factors:
        factor_vars[f.variable] = f
        key_by_display = _DISPLAY_TO_KEY.get(f.variable)
        if key_by_display:
            factor_vars[key_by_display] = f

    if "trestbps" in factor_vars and evaluation.trestbps > 140:
        recs.append("Controlar rigorosamente a pressão arterial com medicação conforme orientação médica")
    if "chol" in factor_vars and evaluation.chol > 240:
        recs.append("Reduzir os níveis de colesterol com dieta específica e medicação se necessário")
    if "oldpeak" in factor_vars and evaluation.oldpeak > 2:
        recs.append("Avaliar isquemia miocárdica com teste ergométrico ou cintilografia")
    if "thalach" in factor_vars and evaluation.thalach < 100:
        recs.append("Investigar causa da baixa frequência cardíaca máxima ao esforço")

    # --- Recomendações baseadas em variáveis clínicas alteradas ---
    # Variáveis binárias ou categóricas que indicam condições específicas.
    if evaluation.fbs == 1:
        recs.append("Avaliar quadro de diabetes mellitus e controlar rigorosamente a glicemia")
    if evaluation.exang == 1:
        recs.append("Avaliar angina aos esforços com teste provocativo de isquemia")
    if evaluation.cp in (3, 4):
        recs.append("Investigar quadro de dor torácica com avaliação cardiológica detalhada")
    if evaluation.ca > 0:
        recs.append("Avaliar necessidade de cineangiocoronariografia para estratificação anatômica")
    if evaluation.thal in (6, 7):
        recs.append("Avaliar talassemia e sua contribuição para o risco cardiovascular")
    if evaluation.slope == 3:
        recs.append("Avaliar isquemia miocárdica ao esforço com exame funcional")
    if evaluation.restecg in (1, 2):
        recs.append("Avaliar alterações no ECG de repouso com ecocardiograma")

    # --- Recomendação geral de estilo de vida ---
    # Válida para qualquer paciente, independente do nível de risco.
    recs.append("Manter dieta equilibrada, praticar atividade física regular e evitar tabagismo")

    return recs
