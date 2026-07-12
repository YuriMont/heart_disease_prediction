## Why

O botão "Exportar Relatório" na página de resultado da avaliação atualmente apenas salva um texto plano no banco e mostra um `alert`. O usuário espera receber um PDF real para download. A página `/reports` lista esses relatórios mas não oferece valor real, pois o conteúdo textual nunca é visualizado e o botão "Exportar PDF" lá também não funciona.

## What Changes

- **`POST /reports/export`** — mantido como está (cria/retorna relatório textual no BD)
- **`GET /reports/{report_id}/pdf`** — **novo** endpoint que gera e retorna um PDF formatado do relatório
- **Botão "Exportar Relatório"** na página `/evaluation/$id` — alterado para criar o relatório via POST e, em seguida, fazer o download do PDF
- **Página `/reports`** — **removida** (rota, arquivos e entrada no router)
- **Dependência `fpdf2`** — adicionada ao backend para geração de PDF

## Capabilities

### New Capabilities
- `report-pdf-export`: Geração e download de relatório em PDF formatado com dados da avaliação, resultado, fatores contribuintes, importância das características, dados clínicos e recomendações.

### Modified Capabilities
<!-- No existing specs to modify -->

## Impact

- **Backend**: novo endpoint `GET /reports/{report_id}/pdf`; dependência `fpdf2` em `pyproject.toml`
- **Frontend**: alteração do handler de export na página `/evaluation/$id`; remoção da rota `/reports/` e página `routes/reports/index.tsx`; remoção do link para reports do menu/layout se existir
- **Router**: registro do TanStack Router removido para a rota `/reports/`
- **API Client**: novo hook `useGetReportPdfReportsReportIdPdfGet` (ou download direto via URL)
