## 1. Backend: Adicionar dependência fpdf2

- [x] 1.1 Adicionar `fpdf2` ao `pyproject.toml` (apps/server)
- [x] 1.2 Instalar dependência com `uv sync`

## 2. Backend: Service de geração de PDF

- [x] 2.1 Criar `apps/server/src/services/report_pdf.py` com função `generate_pdf_report(evaluation, factors, importance)`
- [x] 2.2 Configurar fpdf2 com margens 20mm lateral, 15mm topo/rodapé e fonte Helvetica
- [x] 2.3 Implementar header: título "CardioPredict — Cardiovascular Evaluation Report", data, ID, paciente e modelo (fonte Helvetica Bold 18pt, cor `#BE1E2D`)
- [x] 2.4 Implementar seção de resultado: badge de risco (retângulo arredondado colorido com texto branco), probabilidade em destaque, texto de conclusão
- [x] 2.5 Implementar tabela de dados clínicos com 13 linhas (label + valor)
- [x] 2.6 Implementar seção de fatores contribuintes ordenados por impacto absoluto
- [x] 2.7 Implementar seção de importância das características com barra visual de peso
- [x] 2.8 Implementar seção de recomendações no PDF (geradas dinamicamente, sem hardcoded)
- [x] 2.9 Implementar seção de disclaimer médico
- [x] 2.10 Aplicar paleta de cores: primary `#BE1E2D`, risk-low `#059669`, risk-med `#D97706`, risk-high `#DC2626`, texto `#1E293B`/`#64748B`/`#94A3B8`

## 2b. Backend: Service de recomendações dinâmicas

- [x] 2b.1 Criar `apps/server/src/services/recommendations.py` com função `generate_recommendations(evaluation, factors)`
- [x] 2b.2 Mapear regras com comentários explicativos: risco HIGH → urgência, risco MEDIUM → acompanhamento, risco LOW → manutenção
- [x] 2b.3 Mapear fatores contribuintes para recomendações específicas com comentários (ex: trestbps > 140 → "Controlar a pressão arterial")
- [x] 2b.4 Mapear variáveis clínicas alteradas com comentários (ex: fbs == 1 → "Avaliar quadro de diabetes", exang == 1 → "Avaliar angina")
- [x] 2b.5 Integrar `generate_recommendations` no service `report_pdf.py`

## 3. Backend: Endpoint GET /evaluations/{evaluation_id}/report-pdf

- [x] 3.1 Adicionar endpoint `async` em `apps/server/src/api/routes/evaluations.py` que busca evaluation + factors + importance e retorna `StreamingResponse` com PDF
- [x] 3.2 Aplicar `@cache(expire=3600)` do fastapi-cache2 no endpoint (handler async obrigatório)
- [x] 3.3 Configurar Content-Type: application/pdf e Content-Disposition: attachment com filename "cardiopredict-relatorio-{id}.pdf"

## 4. Frontend: Atualizar botão de export com fetch + blob + toast + loading

- [x] 4.1 Criar função `handleExport` com fetch para `/api/evaluations/{id}/report-pdf` e response.blob()
- [x] 4.2 Adicionar loading state: desabilitar botão e texto "Gerando..." durante a requisição
- [x] 4.3 Adicionar toast de feedback: "Gerando relatório..." (loading), "Relatório baixado com sucesso!" (sucesso), "Erro ao gerar relatório" (erro) via sonner
- [x] 4.4 Disparar download do blob via `<a>` click programático com filename do Content-Disposition
- [x] 4.5 Remover import e uso de `useExportReportReportsExportPost`

## 5. Frontend: Remover página /reports

- [x] 5.1 Deletar `apps/web/src/routes/reports/index.tsx`
- [x] 5.2 Remover link "Relatórios" da sidebar em `apps/web/src/components/layout/sidebar.tsx`
- [x] 5.3 Regenerar route tree (rodar dev ou `npm run generate:api`)

## 6. Verificação

- [x] 6.1 Rodar `npm run lint && npm run typecheck`
