# Graph Report - pibic  (2026-09-15)

## Corpus Check
- 230 files · ~100,856 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1588 nodes · 2356 edges · 188 communities (128 shown, 60 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 79 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3b22eb10`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReportPDF
- server.cjs
- badge.tsx
- evaluations.ts
- evaluations.zod.ts
- routeTree.gen.ts
- $id/index.tsx
- scripts
- CardioPredict — Guia de Desenvolvimento
- form-wizard.tsx
- routes/models.py
- models.ts
- compilerOptions
- PatientResponse
- reports.ts
- base.py
- dashboard.ts
- CardioPredict — Predição de Doença Cardíaca
- components.json
- compilerOptions
- Requirements
- Visual Companion Guide
- ADDED Requirements
- results/index.tsx
- ADDED Requirements
- cn
- Requirement: Replace custom UI components with shadcn equivalents
- patients.ts
- What You Must Do When Invoked
- ADDED Requirements
- CardioPredict — Manual do Agente
- Find Skills
- Server — API de Predição de Doença Cardíaca
- patients.zod.ts
- api
- Requirement: Constants module provides typed accessors
- Writing Plans
- Evaluation
- caveman/SKILL.md
- reports.py
- 2026-06-29-refactor-clean-code/tasks.md
- Decisions
- data.py
- dependencies
- clsx
- Web — Frontend de Avaliação de Risco Cardíaco
- .claude/skills/openspec-explore/SKILL.md
- .opencode/skills/openspec-explore/SKILL.md
- pages.py
- models.zod.ts
- explore.md
- opsx-explore.md
- Decisions
- 2026-07-09-integrate-shadcn-ui/design.md
- helper.js
- Brainstorming Ideas Into Designs
- FastAPI Project Templates
- devDependencies
- evaluations.py
- scripts
- ADDED Requirements
- Implementation Patterns
- schemas/dashboard.py
- 2026-07-12-export-report-pdf/tasks.md
- stop-server.sh
- Frontend Design
- reports.zod.ts
- 2026-06-29-refactor-clean-code/proposal.md
- 2026-07-09-extract-feature-config/proposal.md
- 2026-07-09-integrate-shadcn-ui/proposal.md
- 2026-07-09-require-patient-for-evaluation/proposal.md
- 2026-07-12-export-report-pdf/proposal.md
- dashboard.zod.ts
- tsconfig.json
- 2026-07-09-require-patient-for-evaluation/tasks.md
- EvaluationForm
- RedirectMiddleware
- TestRedirectMiddleware
- web/package.json
- 2026-07-09-extract-feature-config/design.md
- 2026-07-09-require-patient-for-evaluation/design.md
- useListEvaluationsEvaluationsGet
- opencode.json
- 2026-07-09-extract-feature-config/tasks.md
- 2026-07-09-integrate-shadcn-ui/tasks.md
- start-server.sh
- Web Search & Extraction
- sonner
- @eslint/js
- graphify.js
- spec-document-reviewer-prompt.md
- plan-document-reviewer-prompt.md
- machine_learning/__init__.py
- class-variance-authority
- @fontsource-variable/dm-sans
- @fontsource-variable/inter
- @fontsource-variable/jetbrains-mono
- jotai
- lucide-react
- next-themes
- radix-ui
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-label
- @radix-ui/react-progress
- @radix-ui/react-select
- @radix-ui/react-separator
- @radix-ui/react-slot
- @radix-ui/react-tabs
- @radix-ui/react-tooltip
- react
- react-dom
- react-hook-form
- recharts
- shadcn
- connection.py
- tailwind-merge
- tailwindcss-animate
- @tailwindcss/vite
- report_pdf.py
- PaginatedResponse
- @tanstack/react-router-devtools
- modelMetrics.ts
- index.ts
- zod
- @tanstack/router-plugin
- constants/__init__.py
- listPatientsPatientsGetParams.ts
- eslint-plugin-prettier
- eslint-plugin-react-hooks
- riskFactorsResponse.ts
- globals
- orval
- @hookform/resolvers
- prettier-plugin-tailwindcss
- typescript
- @tanstack/react-router
- @types/react-dom
- @vitejs/plugin-react
- general.zod.ts
- vercel.json
- server
- typescript-eslint
- graphify reference: extra exports and benchmark
- vite
- graphify reference: query, path, explain
- graphify reference: add a URL and watch a folder
- graphify reference: commit hook and native CLAUDE.md integration
- graphify reference: incremental update and cluster-only
- graphify reference: GitHub clone and cross-repo merge
- graphify reference: transcribe video and audio
- routes/dashboard.py
- tooltip.tsx
- @tanstack/react-table
- .claude/CLAUDE.md
- extraction-spec.md
- eslint-config-prettier

## God Nodes (most connected - your core abstractions)
1. `cn()` - 84 edges
2. `api()` - 29 edges
3. `ReportPDF` - 21 edges
4. `scripts` - 21 edges
5. `Evaluation` - 20 edges
6. `compilerOptions` - 20 edges
7. `compilerOptions` - 16 edges
8. `calculate_contributing_factors()` - 15 edges
9. `handleRequest()` - 14 edges
10. `generate_pdf_report()` - 14 edges

## Surprising Connections (you probably didn't know these)
- `get_stats()` --calls--> `DashboardStats`  [INFERRED]
  apps/server/src/api/routes/dashboard.py → apps/server/src/schemas/dashboard.py
- `get_risk_distribution()` --calls--> `RiskDistribution`  [INFERRED]
  apps/server/src/api/routes/dashboard.py → apps/server/src/schemas/dashboard.py
- `get_risk_factors()` --calls--> `RiskFactorsResponse`  [INFERRED]
  apps/server/src/api/routes/dashboard.py → apps/server/src/schemas/dashboard.py
- `get_risk_factors()` --calls--> `calculate_aggregated_factors()`  [INFERRED]
  apps/server/src/api/routes/dashboard.py → apps/server/src/services/feature_analysis.py
- `create_evaluation()` --calls--> `Evaluation`  [INFERRED]
  apps/server/src/api/routes/evaluations.py → apps/server/src/database/models/evaluation.py

## Import Cycles
- None detected.

## Communities (188 total, 60 thin omitted)

### Community 0 - "ReportPDF"
Cohesion: 0.25
Nodes (6): get_short_name_pt(), generate_pdf_report(), ContributingFactor, FeatureImportance, ReportPDF, BytesIO

### Community 1 - "server.cjs"
Cohesion: 0.06
Nodes (55): bootstrapPage(), brandMarkup(), broadcast(), browserLauncherForPlatform(), chmodOwnerOnly(), clients, companionUrl(), computeAcceptKey() (+47 more)

### Community 2 - "badge.tsx"
Cohesion: 0.36
Nodes (4): ResultHero(), ResultHeroProps, Badge(), badgeVariants

### Community 3 - "evaluations.ts"
Cohesion: 0.08
Nodes (37): CreateEvaluationEvaluationsPostMutationBody, CreateEvaluationEvaluationsPostMutationError, CreateEvaluationEvaluationsPostMutationResult, exportReportPdfEvaluationsEvaluationIdReportPdfPost(), ExportReportPdfEvaluationsEvaluationIdReportPdfPostMutationError, ExportReportPdfEvaluationsEvaluationIdReportPdfPostMutationResult, getEvaluationEvaluationsEvaluationIdGet(), GetEvaluationEvaluationsEvaluationIdGetQueryError (+29 more)

### Community 4 - "evaluations.zod.ts"
Cohesion: 0.05
Nodes (37): CreateEvaluationEvaluationsPostBody, createEvaluationEvaluationsPostBodyAgeMax, createEvaluationEvaluationsPostBodyCaMax, createEvaluationEvaluationsPostBodyCaMin, createEvaluationEvaluationsPostBodyCholExclusiveMin, createEvaluationEvaluationsPostBodyCpMax, createEvaluationEvaluationsPostBodyExangMax, createEvaluationEvaluationsPostBodyExangMin (+29 more)

### Community 5 - "routeTree.gen.ts"
Cohesion: 0.08
Nodes (26): RequirePatientGuard(), RequirePatientGuardProps, queryClient, router, Route, Route, Route, Route (+18 more)

### Community 6 - "$id/index.tsx"
Cohesion: 0.18
Nodes (18): COLORS, LABELS, CustomTooltipProps, ContributingFactors(), ContributingFactorsProps, COLORS, FeatureImportance(), FeatureImportanceProps (+10 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (31): concurrently, devDependencies, concurrently, tailwindcss-animate, tailwindcss-animate, name, private, scripts (+23 more)

### Community 8 - "CardioPredict — Guia de Desenvolvimento"
Cohesion: 0.13
Nodes (14): Backend (`apps/server`), Banco de Dados (Migrations), CardioPredict — Guia de Desenvolvimento, Convenções de Código, 📂 Estrutura do Projeto, Execução, ⚙️ Fluxo de Trabalho, Frontend (`apps/web`) (+6 more)

### Community 9 - "form-wizard.tsx"
Cohesion: 0.11
Nodes (25): selectedPatientAtom, DEFAULT_VALUES_FORM, FormData, PatientFilters(), PatientFiltersProps, PatientFormData, Button(), buttonVariants (+17 more)

### Community 10 - "routes/models.py"
Cohesion: 0.23
Nodes (10): list_features(), list_models(), get, Session, update_model(), ModelFeature, ModelUpdate, BaseModel (+2 more)

### Community 11 - "models.ts"
Cohesion: 0.07
Nodes (36): sidebarOpenAtom, ModelInfo(), MainLayout(), navItems, Sidebar(), Toaster(), getGetMetricsModelsModelIdMetricsGetQueryKey(), getGetMetricsModelsModelIdMetricsGetQueryOptions() (+28 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib, module (+17 more)

### Community 13 - "PatientResponse"
Cohesion: 0.28
Nodes (7): PatientTablePagination(), PatientTablePaginationProps, EvaluationListResponse, EvaluationResponse, PaginationMeta, PatientListResponse, PatientResponse

### Community 14 - "reports.ts"
Cohesion: 0.11
Nodes (22): exportReportReportsExportPost(), ExportReportReportsExportPostMutationBody, ExportReportReportsExportPostMutationError, ExportReportReportsExportPostMutationResult, getExportReportReportsExportPostMutationOptions(), getGetReportReportsReportIdGetQueryKey(), getGetReportReportsReportIdGetQueryOptions(), getListReportsReportsGetQueryKey() (+14 more)

### Community 15 - "base.py"
Cohesion: 0.18
Nodes (7): Run migrations in 'offline' mode. This configures the context with just a URL…, Run migrations in 'online' mode. In this scenario we use the engine already…, run_migrations_offline(), run_migrations_online(), Base, Patient, DeclarativeBase

### Community 16 - "dashboard.ts"
Cohesion: 0.09
Nodes (29): DashboardHeader(), RiskDistribution(), RiskFactors(), StatCardsRow(), StatCard(), StatCardProps, getGetRiskDistributionDashboardRisksGetQueryKey(), getGetRiskDistributionDashboardRisksGetQueryOptions() (+21 more)

### Community 17 - "CardioPredict — Predição de Doença Cardíaca"
Cohesion: 0.09
Nodes (22): Aviso, Backend (`apps/server`), Backend (`apps/server`), Banco de Dados, Campos do Paciente (entrada da predição), CardioPredict — Predição de Doença Cardíaca, Comandos, Comandos Úteis (+14 more)

### Community 18 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 19 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+12 more)

### Community 20 - "Requirements"
Cohesion: 0.10
Nodes (20): Purpose, Report PDF Export, Requirement: Botão "Exportar Relatório" com fetch + blob e feedback visual, Requirement: Conteúdo do PDF é intuitivo, Requirement: Endpoint GET /evaluations/{evaluation_id}/report-pdf, Requirement: PDF segue identidade visual do frontend, Requirement: Página /reports é removida, Requirement: Recomendações geradas dinamicamente (sem hardcoded) (+12 more)

### Community 21 - "Visual Companion Guide"
Cohesion: 0.10
Nodes (19): Browser Events Format, Cards (visual designs), Cleaning Up, CSS Classes Available, Design Tips, File Naming, How It Works, Mock elements (wireframe building blocks) (+11 more)

### Community 22 - "ADDED Requirements"
Cohesion: 0.11
Nodes (18): ADDED Requirements, Requirement: Botão "Exportar Relatório" com fetch + blob e feedback visual, Requirement: Conteúdo do PDF é intuitivo, Requirement: Endpoint GET /evaluations/{evaluation_id}/report-pdf, Requirement: PDF segue identidade visual do frontend, Requirement: Página /reports é removida, Requirement: Recomendações geradas dinamicamente (sem hardcoded), Scenario: Avaliação não encontrada (+10 more)

### Community 23 - "results/index.tsx"
Cohesion: 0.15
Nodes (17): usePatientColumns(), Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle() (+9 more)

### Community 24 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Avaliação usa paciente pré-cadastrado, Requirement: Ação "Nova Avaliação" na listagem de pacientes, Requirement: Estado de paciente selecionado na sessão, Requirement: Select de paciente na tela de avaliação, Requirement: Seleção de paciente como pré-condição para avaliação, Requirement: Unificação do endpoint de predição, Scenario: Acesso com paciente selecionado (+9 more)

### Community 25 - "cn"
Cohesion: 0.08
Nodes (31): ConfusionMatrixCard(), CardAction(), CardFooter(), Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader() (+23 more)

### Community 26 - "Requirement: Replace custom UI components with shadcn equivalents"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: Initialize shadcn/ui with Tailwind CSS v4, Requirement: Map existing design tokens to shadcn CSS variables, Requirement: Preserve existing component behavior and interfaces, Requirement: Remove redundant Radix UI peer dependencies, Requirement: Replace custom UI components with shadcn equivalents, Scenario: CSS variables match existing palette, Scenario: No breaking import changes (+8 more)

### Community 27 - "patients.ts"
Cohesion: 0.12
Nodes (22): PatientForm(), createPatientPatientsPost(), CreatePatientPatientsPostMutationBody, CreatePatientPatientsPostMutationError, CreatePatientPatientsPostMutationResult, getCreatePatientPatientsPostMutationOptions(), getGetPatientPatientsPatientIdGetQueryKey(), getGetPatientPatientsPatientIdGetQueryOptions() (+14 more)

### Community 28 - "What You Must Do When Invoked"
Cohesion: 0.08
Nodes (24): For /graphify add and --watch, For /graphify query, For the commit hook and native CLAUDE.md integration, For --update and --cluster-only, /graphify, Honesty Rules, Interpreter guard for subcommands, Part A - Structural extraction for code files (+16 more)

### Community 29 - "ADDED Requirements"
Cohesion: 0.12
Nodes (15): ADDED Requirements, Requirement: Backward-compatible naming, Requirement: Comments and docstrings in English, Requirement: Consistent casing conventions, Requirement: English-only identifiers, Requirement: File and directory names in English, Requirement: UI text in English, Scenario: All comments are English (+7 more)

### Community 30 - "CardioPredict — Manual do Agente"
Cohesion: 0.13
Nodes (14): CardioPredict — Manual do Agente, Comandos Essenciais, Convenções de Código, Estrutura, Fluxo de ativação automática, Geral, graphify, Habilidades (Skills) (+6 more)

### Community 31 - "Find Skills"
Cohesion: 0.14
Nodes (13): Common Skill Categories, Find Skills, How to Help Users Find Skills, Step 1: Understand What They Need, Step 2: Check the Leaderboard First, Step 3: Search for Skills, Step 4: Verify Quality Before Recommending, Step 5: Present Options to the User (+5 more)

### Community 32 - "Server — API de Predição de Doença Cardíaca"
Cohesion: 0.14
Nodes (13): Aviso, Banco de Dados, Comandos, Como Rodar, Documentação, Endpoints, Estrutura, Exemplo via curl (+5 more)

### Community 33 - "patients.zod.ts"
Cohesion: 0.12
Nodes (15): CreatePatientPatientsPostBody, createPatientPatientsPostBodyAgeMax, createPatientPatientsPostBodyNameOneMax, createPatientPatientsPostBodySexMax, createPatientPatientsPostBodySexMin, CreatePatientPatientsPostResponse, GetPatientPatientsPatientIdGetParams, GetPatientPatientsPatientIdGetResponse (+7 more)

### Community 34 - "api"
Cohesion: 0.23
Nodes (12): getHomeGetQueryKey(), getHomeGetQueryOptions(), homeGet(), HomeGetQueryError, HomeGetQueryResult, SecondParameter, useHomeGet(), withQueryKey() (+4 more)

### Community 35 - "Requirement: Constants module provides typed accessors"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: Constants module provides typed accessors, Requirement: feature_analysis.py consumes constants module, Requirement: Feature metadata is stored in a config file, Scenario: calculate_contributing_factors uses units and labels from config, Scenario: calculate_feature_importance uses display names from config, Scenario: Config file contains categorical feature entries, Scenario: Config file contains continuous feature entries (+5 more)

### Community 36 - "Writing Plans"
Cohesion: 0.15
Nodes (12): Bite-Sized Task Granularity, Execution Handoff, File Structure, No Placeholders, Overview, Plan Document Header, Remember, Scope Check (+4 more)

### Community 37 - "Evaluation"
Cohesion: 0.20
Nodes (16): Evaluation, get_categorical_keys(), get_continuous_keys(), get_display_name(), _add_category_factor(), _add_continuous_factor(), calculate_aggregated_factors(), calculate_contributing_factors() (+8 more)

### Community 38 - "caveman/SKILL.md"
Cohesion: 0.17
Nodes (10): caveman, Example output, How to invoke, See also, What it does, Auto-Clarity, Boundaries, Intensity (+2 more)

### Community 39 - "reports.py"
Cohesion: 0.21
Nodes (13): export_report(), _generate_content(), get_report(), list_reports(), BaseModel, get, post, Session (+5 more)

### Community 40 - "2026-06-29-refactor-clean-code/tasks.md"
Cohesion: 0.17
Nodes (11): 10. Cleanup & Verification, 1. Database Renames, 2. Backend Model & Schema Renames, 3. Backend ML Module Renames, 4. Backend Service & Route Renames, 5. Backend File & Directory Renames, 6. Frontend Generated Code & Hook Updates, 7. Frontend Route Renames (+3 more)

### Community 41 - "Decisions"
Cohesion: 0.17
Nodes (11): 1. Endpoint único: GET /evaluations/{id}/report-pdf, 2. Geração de PDF com fpdf2, 3. Fluxo frontend: fetch + blob + toast + loading state, 4. Identidade Visual do PDF, 5. Recomendações baseadas nos dados da avaliação (sem hardcoded), 6. Cache do endpoint com Redis, 6. Dependência fpdf2, Context (+3 more)

### Community 42 - "data.py"
Cohesion: 0.11
Nodes (21): create_tables(), Model, balance_smote(), binarize_target(), encode_categorical(), fill_missing(), limit_outliers(), load_data() (+13 more)

### Community 43 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, axios, tailwindcss, @tanstack/react-query, @tanstack/react-query-devtools, tw-animate-css, axios, tailwindcss (+3 more)

### Community 45 - "Web — Frontend de Avaliação de Risco Cardíaco"
Cohesion: 0.18
Nodes (10): Backend, Estrutura, Geração de API, Instalação, Licença, Pré-requisitos, Rotas, Scripts (+2 more)

### Community 46 - ".claude/skills/openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 47 - ".opencode/skills/openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 48 - "pages.py"
Cohesion: 0.67
Nodes (3): documentation_scalar(), home(), get

### Community 49 - "models.zod.ts"
Cohesion: 0.20
Nodes (9): GetMetricsModelsModelIdMetricsGetParams, GetMetricsModelsModelIdMetricsGetResponse, ListFeaturesModelsFeaturesGetResponse, ListFeaturesModelsFeaturesGetResponseItem, ListModelsModelsGetResponse, ListModelsModelsGetResponseItem, UpdateModelModelsModelIdPatchBody, UpdateModelModelsModelIdPatchParams (+1 more)

### Community 50 - "explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 51 - "opsx-explore.md"
Cohesion: 0.20
Nodes (9): Check for context, Ending Discovery, Guardrails, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do, When a change exists (+1 more)

### Community 52 - "Decisions"
Cohesion: 0.20
Nodes (9): 1. Rename strategy: bottom-up (DB → models → API → generated code), 2. Database migration: rename columns with Alembic, no data loss, 3. URL endpoint paths renamed with 308 permanent redirect middleware, 4. File renames: git-aware, separate commits per layer, 5. Frontend renaming: regenerate after backend, then manual cleanup, Context, Decisions, Goals / Non-Goals (+1 more)

### Community 53 - "2026-07-09-integrate-shadcn-ui/design.md"
Cohesion: 0.20
Nodes (9): Context, Decision 1: shadcn init with `--style default --yes` flags, Decision 2: Use Zinc as the base color palette, Decision 3: Preserve existing Tailwind theme colors outside shadcn, Decision 4: One-shot component replacement, Decisions, Goals / Non-Goals, Open Questions (+1 more)

### Community 54 - "helper.js"
Cohesion: 0.42
Nodes (7): connect(), nextReconnectDelay(), reloadAfterRecovery(), sessionKey(), setStatus(), showTombstone(), websocketUrl()

### Community 55 - "Brainstorming Ideas Into Designs"
Cohesion: 0.22
Nodes (8): After the Design, Anti-Pattern: "This Is Too Simple To Need A Design", Brainstorming Ideas Into Designs, Checklist, Key Principles, Process Flow, The Process, Visual Companion

### Community 56 - "FastAPI Project Templates"
Cohesion: 0.22
Nodes (8): 1. Project Structure, 2. Dependency Injection, 3. Async Patterns, Core Concepts, Detailed worked examples and patterns, FastAPI Project Templates, Testing, When to Use This Skill

### Community 57 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, eslint, eslint-plugin-react-refresh, prettier, @types/node, @types/react, eslint, eslint-plugin-react-refresh (+3 more)

### Community 58 - "evaluations.py"
Cohesion: 0.38
Nodes (12): create_evaluation(), export_report_pdf(), get_evaluation(), get_factors(), get_importance(), get_recommendations(), list_evaluations(), get (+4 more)

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, format:fix, generate:api, lint, preview (+1 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: Botão "Novo Paciente" funcional, Requirement: Navegação lateral incluir cadastro de paciente, Requirement: Tela de cadastro de paciente, Scenario: Cadastrar paciente com sucesso, Scenario: Cadastrar paciente sem nome, Scenario: Clicar em Novo Paciente, Scenario: Idade inválida

### Community 61 - "Implementation Patterns"
Cohesion: 0.25
Nodes (7): fastapi-templates — detailed worked examples, Implementation Patterns, Pattern 1: Complete FastAPI Application, Pattern 2: CRUD Repository Pattern, Pattern 3: Service Layer, Pattern 4: API Endpoints with Dependencies, Pattern 5: Authentication & Authorization

### Community 62 - "schemas/dashboard.py"
Cohesion: 0.35
Nodes (10): get_metrics(), ConfusionMatrixData, DashboardStats, ModelInfo, ModelMetrics, BaseModel, RiskDistribution, RiskFactor (+2 more)

### Community 63 - "2026-07-12-export-report-pdf/tasks.md"
Cohesion: 0.25
Nodes (7): 1. Backend: Adicionar dependência fpdf2, 2. Backend: Service de geração de PDF, 2b. Backend: Service de recomendações dinâmicas, 3. Backend: Endpoint GET /evaluations/{evaluation_id}/report-pdf, 4. Frontend: Atualizar botão de export com fetch + blob + toast + loading, 5. Frontend: Remover página /reports, 6. Verificação

### Community 64 - "stop-server.sh"
Cohesion: 0.43
Nodes (4): command_has_server_id(), is_brainstorm_server(), mark_stopped(), stop-server.sh script

### Community 65 - "Frontend Design"
Cohesion: 0.29
Nodes (6): Design principles, Frontend Design, Ground it in the subject, More on writing in design, Process: brainstorm, explore, plan, critique, build, critique again, Restraint and self-critique

### Community 66 - "reports.zod.ts"
Cohesion: 0.29
Nodes (6): ExportReportReportsExportPostBody, ExportReportReportsExportPostResponse, GetReportReportsReportIdGetParams, GetReportReportsReportIdGetResponse, ListReportsReportsGetResponse, ListReportsReportsGetResponseItem

### Community 67 - "2026-06-29-refactor-clean-code/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 68 - "2026-07-09-extract-feature-config/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 69 - "2026-07-09-integrate-shadcn-ui/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 70 - "2026-07-09-require-patient-for-evaluation/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 71 - "2026-07-12-export-report-pdf/proposal.md"
Cohesion: 0.29
Nodes (6): Capabilities, Impact, Modified Capabilities, New Capabilities, What Changes, Why

### Community 72 - "dashboard.zod.ts"
Cohesion: 0.33
Nodes (5): GetRiskDistributionDashboardRisksGetResponse, GetRiskDistributionDashboardRisksGetResponseItem, GetRiskFactorsDashboardFactorsGetQueryParams, GetRiskFactorsDashboardFactorsGetResponse, GetStatsDashboardStatsGetResponse

### Community 73 - "tsconfig.json"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 74 - "2026-07-09-require-patient-for-evaluation/tasks.md"
Cohesion: 0.33
Nodes (5): 1. Backend — Modificar `POST /predict` para exigir paciente e persistir, 2. Frontend — Tela de cadastro de paciente, 3. Frontend — Select de paciente na avaliação + guardrail, 4. Frontend — Ação "Avaliar" na listagem de pacientes, 5. Verificação e Limpeza

### Community 75 - "EvaluationForm"
Cohesion: 0.50
Nodes (4): EvaluationForm(), createEvaluationEvaluationsPost(), getCreateEvaluationEvaluationsPostMutationOptions(), useCreateEvaluationEvaluationsPost()

### Community 76 - "RedirectMiddleware"
Cohesion: 0.40
Nodes (3): RedirectMiddleware, BaseHTTPMiddleware, Request

### Community 78 - "web/package.json"
Cohesion: 0.40
Nodes (4): name, private, type, version

### Community 79 - "2026-07-09-extract-feature-config/design.md"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 80 - "2026-07-09-require-patient-for-evaluation/design.md"
Cohesion: 0.40
Nodes (4): Context, Decisions, Goals / Non-Goals, Risks / Trade-offs

### Community 81 - "useListEvaluationsEvaluationsGet"
Cohesion: 0.40
Nodes (5): getListEvaluationsEvaluationsGetQueryKey(), getListEvaluationsEvaluationsGetQueryOptions(), listEvaluationsEvaluationsGet(), useListEvaluationsEvaluationsGet(), ResultsPage()

### Community 82 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 83 - "2026-07-09-extract-feature-config/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Create config file, 2. Create constants module, 3. Refactor feature_analysis.py

### Community 84 - "2026-07-09-integrate-shadcn-ui/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Setup & Initialization, 2. Component Replacement, 3. Cleanup & Verification

### Community 86 - "Web Search & Extraction"
Cohesion: 0.12
Nodes (16): Available Apps, Documentation, Exa, Exa Answer, Exa Extract, Exa Search, Examples, Quick Start (+8 more)

### Community 110 - "react"
Cohesion: 0.67
Nodes (3): react, RocCurveCard(), react

### Community 115 - "connection.py"
Cohesion: 0.38
Nodes (4): lifespan(), dotenv, dotenv, FastAPI

### Community 119 - "report_pdf.py"
Cohesion: 0.22
Nodes (8): ContributingFactor, FeatureImportance, BaseModel, generate_recommendations(), ContributingFactor, _risk_color(), _risk_label(), FPDF

### Community 120 - "PaginatedResponse"
Cohesion: 0.15
Nodes (20): create_patient(), get_patient(), list_patients(), get, post, Session, UUID, PaginatedResponse (+12 more)

### Community 122 - "modelMetrics.ts"
Cohesion: 0.39
Nodes (5): ConfusionMatrixCardProps, RocCurveCardProps, ConfusionMatrixData, ModelMetrics, RocPoint

### Community 123 - "index.ts"
Cohesion: 0.16
Nodes (9): DashboardStats, EvaluationCreate, GetRiskFactorsDashboardFactorsGetParams, HTTPValidationError, ListEvaluationsEvaluationsGetParams, ModelFeature, ModelFeatureCategories, ValidationError (+1 more)

### Community 126 - "constants/__init__.py"
Cohesion: 0.36
Nodes (7): FeatureConfig, FeaturesConfig, get_categories(), get_unit(), _parse_key(), BaseModel, _format_value()

### Community 173 - "graphify reference: extra exports and benchmark"
Cohesion: 0.22
Nodes (8): graphify reference: extra exports and benchmark, Step 6b - Wiki (only if --wiki flag), Step 7 - Neo4j export (only if --neo4j or --neo4j-push flag), Step 7a - FalkorDB export (only if --falkordb or --falkordb-push flag), Step 7b - SVG export (only if --svg flag), Step 7c - GraphML export (only if --graphml flag), Step 7d - MCP server (only if --mcp flag), Step 8 - Token reduction benchmark (only if total_words > 5000)

### Community 175 - "graphify reference: query, path, explain"
Cohesion: 0.33
Nodes (5): For /graphify explain, For /graphify path, graphify reference: query, path, explain, Step 0 — Constrained query expansion (REQUIRED before traversal), Step 1 — Traversal

### Community 176 - "graphify reference: add a URL and watch a folder"
Cohesion: 0.50
Nodes (3): For /graphify add, For --watch, graphify reference: add a URL and watch a folder

### Community 177 - "graphify reference: commit hook and native CLAUDE.md integration"
Cohesion: 0.50
Nodes (3): For git commit hook, For native CLAUDE.md integration, graphify reference: commit hook and native CLAUDE.md integration

### Community 178 - "graphify reference: incremental update and cluster-only"
Cohesion: 0.50
Nodes (3): For --cluster-only, For --update (incremental re-extraction), graphify reference: incremental update and cluster-only

### Community 182 - "routes/dashboard.py"
Cohesion: 0.57
Nodes (6): _classify_risk(), get_risk_distribution(), get_risk_factors(), get_stats(), get, Session

## Knowledge Gaps
- **700 isolated node(s):** `crypto`, `http`, `fs`, `path`, `OPCODES` (+695 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **60 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `dependencies` connect `dependencies` to `@hookform/resolvers`, `@tanstack/react-router`, `clsx`, `@tanstack/react-table`, `web/package.json`, `sonner`, `class-variance-authority`, `@fontsource-variable/dm-sans`, `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono`, `jotai`, `lucide-react`, `next-themes`, `radix-ui`, `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-progress`, `@radix-ui/react-select`, `@radix-ui/react-separator`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-tooltip`, `react`, `react-dom`, `react-hook-form`, `recharts`, `shadcn`, `tailwind-merge`, `tailwindcss-animate`, `@tailwindcss/vite`, `@tanstack/react-router-devtools`, `zod`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `dependencies`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Why does `RocCurveCard()` connect `react` to `cn`, `$id/index.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `ReportPDF` (e.g. with `Evaluation` and `ContributingFactor`) actually correct?**
  _`ReportPDF` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `crypto`, `http`, `fs` to the rest of the system?**
  _700 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `server.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05868118572292801 - nodes in this community are weakly interconnected._
- **Should `evaluations.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08392603129445235 - nodes in this community are weakly interconnected._