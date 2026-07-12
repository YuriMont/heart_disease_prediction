## Context

O botão "Exportar Relatório" na página de resultado da avaliação (`/evaluation/$id`) atualmente faz um POST para `/reports/export`, que salva um texto plano no banco e exibe um `alert("sucesso")`. Não há download de PDF.

A página `/reports` lista os relatórios salvos, mas o conteúdo textual nunca é apresentado ao usuário e o botão "Exportar PDF" nessa página é um placeholder quebrado.

## Goals / Non-Goals

**Goals:**
- Botão "Exportar Relatório" chama **um único endpoint** que gera e retorna o PDF
- PDF com identidade visual consistente com o frontend (cores, tipografia, espaçamentos)
- Informações organizadas de forma intuitiva: resultado em destaque, dados clínicos em tabela, fatores/importância em seções separadas
- Feedback visual: toast de sucesso/erro e loading state no botão durante o download
- Remover a página `/reports` e seu link na sidebar

**Non-Goals:**
- Não criar registro no banco (PDF gerado on-the-fly)
- Não alterar o layout/página de resultado da avaliação

## Decisions

### 1. Endpoint único: GET /evaluations/{id}/report-pdf

**Decisão:** Endpoint no router de evaluations que busca evaluation + factors + importance e monta o PDF em memória.

### 2. Geração de PDF com fpdf2

**Decisão:** Adicionar `fpdf2` como dependência e criar service `report_pdf.py`.

**Alternativas consideradas:** reportlab (API complexa), weasyprint (deps de sistema), jsPDF (duplicação de lógica).

### 3. Fluxo frontend: fetch + blob + toast + loading state

**Decisão:** Usar `fetch` + `response.blob()` para ter controle total sobre o download, combinado com toast (sonner) e loading state no botão.

Fluxo:
1. Usuário clica "Exportar Relatório"
2. Botão desabilita e mostra "Gerando..."
3. Toast "Gerando relatório..." aparece
4. Fetch para `/api/evaluations/{id}/report-pdf`
5. Se sucesso: blob → <a> click → download disparado + toast "Relatório baixado com sucesso!"
6. Se erro: toast com mensagem de erro
7. Botão volta ao estado normal

**Alternativas consideradas:**
- **window.open()**: Não permite detectar fim do download nem tratar erros.
- **iframe oculto**: Mesma limitação do window.open.

**Por que fetch + blob:** Controle total sobre loading, erro e sucesso. O sonner já está no projeto (`^2.0.7`) integrado no layout.

### 4. Identidade Visual do PDF

O PDF deve ser visualmente consistente com o frontend, utilizando cores, tipografia e espaçamentos equivalentes.

**Paleta de cores (RGB para PDF):**

| Token | Cor | Uso |
|-------|-----|-----|
| `$primary` | `#BE1E2D` (vermelho) | Cabeçalho, títulos principais, acentos |
| `$risk-low` | `#059669` (verde) | Badge "Baixo Risco" |
| `$risk-med` | `#D97706` (âmbar) | Badge "Risco Médio" |
| `$risk-high` | `#DC2626` (vermelho) | Badge "Alto Risco" |
| `$text-primary` | `#1E293B` (slate 900) | Corpo do texto |
| `$text-secondary` | `#64748B` (slate 500) | Labels, legendas |
| `$text-muted` | `#94A3B8` (slate 400) | Dados secundários |
| `$surface` | `#FFFFFF` (branco) | Fundo dos cards |
| `$surface-muted` | `#F8FAFC` (slate 50) | Fundo de tabelas/linhas alternadas |
| `$border` | `#E2E8F0` (slate 200) | Bordas dos cards e tabelas |

**Tipografia:**
- Título principal: Helvetica Bold, 18pt, cor `$primary`
- Subtítulo/cabeçalho de seção: Helvetica Bold, 12pt, cor `$text-primary`
- Labels: Helvetica, 9pt, cor `$text-secondary`
- Valores/dados: Helvetica, 9pt, cor `$text-primary`
- Tabela cabeçalho: Helvetica Bold, 8pt, fundo `$surface-muted`
- Tabela células: Helvetica, 8.5pt
- Disclaimer: Helvetica, 7pt, cor `$text-muted`
- Dados numéricos (probabilidade, métricas): Helvetica Bold, cor conforme contexto

**Layout:**
- Margens: 20mm (laterais), 15mm (topo/rodapé)
- Cards com borda de 0.5pt na cor `$border`, padding de 6mm
- Tabelas com linhas alternadas (branco / `$surface-muted`)
- Resultado principal em destaque (card com fundo colorido conforme risco)
- Badge de risco: texto branco em retângulo arredondado com cor de risco
- Barra de probabilidade: retângulo preenchido proporcional à cor de risco

**Seções do PDF (ordem vertical):**
1. **Header**: logotipo CardioPredict + "Cardiovascular Evaluation Report" + data
2. **Resultado**: card com badge de risco, probabilidade em destaque, conclusão
3. **Dados da Avaliação**: tabela com 13 linhas (label + valor)
4. **Fatores Contribuintes**: lista ordenada com ícone de impacto (+/-) e valor
5. **Importância das Características**: lista com nome e barra de peso
6. **Recomendações**: parágrafo numerado com 5 recomendações
7. **Disclaimer**: disclaimer médico em fonte menor

**Intencionalidade visual:**
- O resultado (risco + probabilidade) deve ser a primeira coisa que o leitor vê
- Dados clínicos em tabela limpa para consulta rápida
- Fatores contribuintes ordenados por impacto absoluto para destacar o que mais influenciou
- Importância com barra visual para comparação relativa entre variáveis
- Recomendações em linguagem clara em português

### 5. Recomendações baseadas nos dados da avaliação (sem hardcoded)

**Decisão:** Criar service `recommendations.py` no backend que gera recomendações dinâmicas com base em:
- Nível de risco (HIGH/MEDIUM/LOW)
- Fatores contribuintes (ex: se "trestbps" está entre os top fatores, incluir recomendação específica de pressão arterial)
- Variáveis clínicas alteradas (ex: se `fbs == 1`, recomendação sobre glicemia)

Isso substitui o texto hardcoded do componente `Recommendations` do frontend. O PDF usará as recomendações geradas por esse service.

**Disclaimer**: texto institucional fixo (não é hardcoded de dados, é conteúdo legal necessário).

### 6. Cache do endpoint com Redis

**Decisão:** Usar `@cache(expire=3600)` do `fastapi-cache2` (já configurado no projeto com Redis) no endpoint PDF.

Como a avaliação é imutável após criada, o PDF gerado é sempre o mesmo. Cache de 1 hora (3600s) evita regeneração desnecessária sem ocupar Redis por muito tempo. O handler precisa ser `async` para o decorator funcionar.

### 6. Dependência fpdf2

Adicionar ao `pyproject.toml`. fpdf2 suporta Unicode ( necessário para português), fontes padrão (Helvetica, Courier) e construção programática de tabelas.

## Risks / Trade-offs

- **[Dependência nova]** `fpdf2` é leve (~200KB), sem deps nativas.
- **[Fontes]** fpdf2 usa fontes padrão PDF (Helvetica/Courier). Para usar DM Sans/Inter seria necessário incorporar arquivos .ttf, o que aumenta o tamanho do service. **Decisão:** Usar Helvetica como aproximação, que é visualmente próxima do Inter e tem boa legibilidade em PDF.
- **[Performance]** PDF gerado sob demanda. Geração leva milissegundos.
