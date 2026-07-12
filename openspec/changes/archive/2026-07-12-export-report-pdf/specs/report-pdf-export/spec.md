## ADDED Requirements

### Requirement: Endpoint GET /evaluations/{evaluation_id}/report-pdf

O sistema SHALL expor um endpoint `GET /evaluations/{evaluation_id}/report-pdf` que gera e retorna um PDF do relatório de avaliação cardíaca.

O endpoint SHALL:
- Receber o ID da avaliação como parâmetro de path
- Buscar a avaliação, fatores contribuintes e importância das características no banco
- Gerar um PDF formatado em memória usando fpdf2
- Retornar `Content-Type: application/pdf` com `Content-Disposition: attachment`

Se a avaliação não existir, MUST retornar 404.

O endpoint SHALL usar `@cache(expire=3600)` do fastapi-cache2 com Redis para evitar regeneração desnecessária. O handler SHALL ser `async` para compatibilidade com o decorator de cache.

#### Scenario: Resposta em cache
- **WHEN** GET /evaluations/{evaluation_id}/report-pdf é chamado duas vezes para o mesmo ID
- **THEN** segunda chamada retorna o PDF do cache Redis (sem regerar)

#### Scenario: Download bem-sucedido
- **WHEN** GET /evaluations/{evaluation_id}/report-pdf é chamado com ID válido
- **THEN** resposta tem status 200
- **THEN** Content-Type é application/pdf
- **THEN** Content-Disposition é attachment com filename "cardiopredict-relatorio-{id}.pdf"

#### Scenario: Avaliação não encontrada
- **WHEN** GET /evaluations/{evaluation_id}/report-pdf é chamado com ID inexistente
- **THEN** resposta tem status 404

### Requirement: PDF segue identidade visual do frontend

O PDF SHALL utilizar paleta de cores, tipografia e layout consistentes com o frontend.

**Paleta de cores RGB:**
- Primary (títulos, header): `#BE1E2D`
- Risco baixo (badge, destaque): `#059669`
- Risco médio (badge, destaque): `#D97706`
- Risco alto (badge, destaque): `#DC2626`
- Texto principal: `#1E293B`
- Texto secundário: `#64748B`
- Texto muted: `#94A3B8`
- Fundo superfície: `#FFFFFF`
- Fundo cabeçalho de tabela: `#F8FAFC`
- Borda: `#E2E8F0`

**Tipografia:**
- Título principal: Helvetica Bold 18pt
- Cabeçalhos de seção: Helvetica Bold 12pt
- Labels e legendas: Helvetica 9pt
- Dados de tabela: Helvetica 8.5pt
- Disclaimer: Helvetica 7pt

**Layout:**
- Margens de 20mm laterais, 15mm topo/rodapé
- Cards com borda 0.5pt e padding 6mm
- Tabelas com linhas alternadas
- Badge de risco arredondado com texto branco sobre fundo colorido

#### Scenario: PDF contém todas as seções
- **WHEN** sistema gera o PDF para uma avaliação válida
- **THEN** PDF contém header com logotipo, resultado em destaque, dados clínicos em tabela, fatores contribuintes ordenados, importância, recomendações e disclaimer

#### Scenario: PDF usa cores consistentes
- **WHEN** sistema gera o PDF
- **THEN** cores utilizadas correspondem à paleta definida
- **THEN** badge de risco usa a cor correspondente (verde/âmbar/vermelho)

### Requirement: Conteúdo do PDF é intuitivo

O PDF SHALL apresentar as informações em ordem de importância visual:

1. **Header**: identificação do relatório (título, data, ID, nome do paciente, modelo)
2. **Resultado**: card em destaque com badge de risco e probabilidade em evidência
3. **Dados clínicos**: tabela com campo + valor para consulta rápida
4. **Fatores contribuintes**: lista ordenada por impacto absoluto (maior primeiro)
5. **Importância das características**: lista com barra visual de peso
6. **Recomendações**: recomendações geradas dinamicamente com base no nível de risco, fatores contribuintes e variáveis clínicas alteradas — NENHUM dado hardcoded/mocado
7. **Disclaimer**: aviso médico em fonte reduzida

#### Scenario: Ordem das seções
- **WHEN** PDF é aberto
- **THEN** resultado é a primeira seção de destaque visível
- **THEN** fatores contribuintes estão ordenados do maior impacto para o menor

### Requirement: Recomendações geradas dinamicamente (sem hardcoded)

O sistema SHALL gerar recomendações no backend com base nos dados reais da avaliação:
- Nível de risco (HIGH/MEDIUM/LOW) determina urgência e tom das recomendações
- Fatores contribuintes (ex: pressão arterial elevada → recomendação específica sobre PA)
- Variáveis clínicas alteradas (ex: glicemia > 120 → recomendação sobre diabetes)
- NENHUMA recomendação SHALL ser texto fixo/hardcoded

O sistema SHALL ter um service `recommendations.py` que recebe evaluation + factors e retorna lista de strings.

As regras de recomendação SHALL ser documentadas com comentários explicando o propósito de cada grupo:

```python
# --- Recomendações baseadas no nível de risco ---
# Quanto maior o risco, mais urgente o tom da recomendação.
# HIGH → "Buscar atendimento médico urgente"
# MEDIUM → "Agendar consulta com cardiologista"
# LOW → "Manter hábitos saudáveis"

# --- Recomendações baseadas em fatores contribuintes ---
# Cada variável clínica que aparece entre os top fatores contribuintes
# gera uma recomendação específica. Exemplos:
# trestbps > 140 → "Controlar a pressão arterial"
# chol > 240 → "Reduzir colesterol com dieta e medicação"
# oldpeak > 2 → "Avaliar isquemia miocárdica"
# A lógica verifica o valor real da variável na evaluation, não apenas
# se ela está na lista de fatores.

# --- Recomendações baseadas em variáveis clínicas alteradas ---
# Variáveis binárias/categóricas que indicam alteração:
# fbs == 1 (glicemia elevada) → "Avaliar quadro de diabetes"
# exang == 1 (angina aos esforços) → "Avaliar angina"
# cp in (3, 4) (dor torácica atípica/assintomática) → "Investigar dor torácica"
# ca > 0 (vasos afetados) → "Avaliar necessidade de cineangiocoronariografia"
# thal in (6, 7) (defeito fixo/reversível) → "Avaliar talassemia"
# slope == 3 (ST downsloping) → "Avaliar isquemia ao esforço"
# restecg in (1, 2) (alteração ST/T ou hipertrofia LV) → "Avaliar ECG de repouso"
```

#### Scenario: Recomendação baseada em fator contribuinte
- **WHEN** evaluation tem `trestbps > 140` entre os top fatores contribuintes
- **THEN** uma das recomendações menciona controle de pressão arterial

#### Scenario: Recomendação baseada em risco alto
- **WHEN** riskLevel é HIGH
- **THEN** recomendações incluem "Buscar atendimento médico urgente"

### Requirement: Botão "Exportar Relatório" com fetch + blob e feedback visual

O botão "Exportar Relatório" na página `/evaluation/$id` SHALL:

1. Ao ser clicado, desabilitar o botão e alterar o texto para "Gerando..."
2. Fazer fetch para `/api/evaluations/{evaluation_id}/report-pdf`
3. Exibir toast "Gerando relatório..." via sonner
4. Em caso de sucesso: criar blob URL e disparar download via `<a>` click programático
5. Em caso de sucesso: exibir toast "Relatório baixado com sucesso!"
6. Em caso de erro: exibir toast "Erro ao gerar relatório"
7. Reabilitar o botão e restaurar o texto original ao final

#### Scenario: Download bem-sucedido
- **WHEN** usuário clica "Exportar Relatório"
- **THEN** botão desabilita e mostra "Gerando..."
- **THEN** toast "Gerando relatório..." é exibido
- **THEN** navegador baixa o arquivo PDF via blob
- **THEN** toast "Relatório baixado com sucesso!" é exibido
- **THEN** botão reabilita e volta a "Exportar Relatório"

#### Scenario: Erro no download
- **WHEN** usuário clica "Exportar Relatório"
- **THEN** botão desabilita e mostra "Gerando..."
- **THEN** requisição falha
- **THEN** toast "Erro ao gerar relatório" é exibido
- **THEN** botão reabilita e volta a "Exportar Relatório"

### Requirement: Página /reports é removida

A página `/reports` SHALL ser removida do frontend:
- Arquivo `apps/web/src/routes/reports/index.tsx` SHALL ser deletado
- Link "Relatórios" na sidebar SHALL ser removido

#### Scenario: Navegação sem rota de relatórios
- **WHEN** usuário tenta acessar /reports
- **THEN** sistema mostra 404
- **WHEN** usuário abre a sidebar
- **THEN** link "Relatórios" não está presente
