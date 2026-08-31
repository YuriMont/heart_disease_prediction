# Graph Report - pibic  (2026-08-21)

## Corpus Check
- 214 files · ~88,003 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1492 nodes · 2234 edges · 167 communities (113 shown, 54 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 78 edges (avg confidence: 0.68)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b3f8350a`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- ReportPDF
- server.cjs
- models/index.tsx
- evaluations.ts
- evaluations.zod.ts
- routeTree.gen.ts
- dashboard.ts
- scripts
- CardioPredict — Guia de Desenvolvimento
- form-wizard.tsx
- schemas/dashboard.py
- models.ts
- compilerOptions
- patients.ts
- reports.ts
- patients.py
- patient-form.tsx
- CardioPredict — Predição de Doença Cardíaca
- components.json
- compilerOptions
- Requirements
- Visual Companion Guide
- ADDED Requirements
- patients/index.tsx
- ADDED Requirements
- cn
- Requirement: Replace custom UI components with shadcn equivalents
- useListEvaluationsEvaluationsGet
- patients.zod.ts
- ADDED Requirements
- CardioPredict — Manual do Agente
- Find Skills
- Server — API de Predição de Doença Cardíaca
- results/index.tsx
- api
- Requirement: Constants module provides typed accessors
- Writing Plans
- clsx
- caveman/SKILL.md
- reports.py
- 2026-06-29-refactor-clean-code/tasks.md
- Decisions
- data.py
- dependencies
- devDependencies
- Web — Frontend de Avaliação de Risco Cardíaco
- .claude/skills/openspec-explore/SKILL.md
- .opencode/skills/openspec-explore/SKILL.md
- FastAPI
- models.zod.ts
- explore.md
- opsx-explore.md
- Decisions
- 2026-07-09-integrate-shadcn-ui/design.md
- helper.js
- Brainstorming Ideas Into Designs
- FastAPI Project Templates
- base.py
- connection.py
- scripts
- ADDED Requirements
- Implementation Patterns
- prediction_service.py
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
- env.py
- RedirectMiddleware
- TestRedirectMiddleware
- web/package.json
- 2026-07-09-extract-feature-config/design.md
- 2026-07-09-require-patient-for-evaluation/design.md
- opencode.json
- 2026-07-09-extract-feature-config/tasks.md
- 2026-07-09-integrate-shadcn-ui/tasks.md
- start-server.sh
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
- sonner
- tailwind-merge
- tailwindcss-animate
- @tailwindcss/vite
- @tanstack/react-query
- @tanstack/react-router-devtools
- @tanstack/react-table
- tw-animate-css
- zod
- eslint
- eslint-config-prettier
- @eslint/js
- eslint-plugin-prettier
- eslint-plugin-react-hooks
- eslint-plugin-react-refresh
- globals
- orval
- prettier
- prettier-plugin-tailwindcss
- @types/node
- @types/react
- @types/react-dom
- @vitejs/plugin-react
- general.zod.ts
- server

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
- `main()` --calls--> `prepare_data()`  [INFERRED]
  apps/server/src/services/train_models.py → apps/server/src/machine_learning/data.py
- `lifespan()` --calls--> `create_tables()`  [INFERRED]
  apps/server/src/api/app/app.py → apps/server/src/database/connection.py
- `get_risk_factors()` --calls--> `calculate_aggregated_factors()`  [INFERRED]
  apps/server/src/api/routes/dashboard.py → apps/server/src/services/feature_analysis.py
- `list_patients()` --calls--> `PaginationMeta`  [INFERRED]
  apps/server/src/api/routes/patients.py → apps/server/src/schemas/common.py
- `list_patients()` --calls--> `PatientListResponse`  [INFERRED]
  apps/server/src/api/routes/patients.py → apps/server/src/schemas/patient.py

## Import Cycles
- None detected.

## Communities (167 total, 54 thin omitted)

### Community 0 - "ReportPDF"
Cohesion: 0.06
Nodes (61): create_evaluation(), export_report_pdf(), get_evaluation(), get_factors(), get_importance(), get_recommendations(), list_evaluations(), get (+53 more)

### Community 1 - "server.cjs"
Cohesion: 0.06
Nodes (55): bootstrapPage(), brandMarkup(), broadcast(), browserLauncherForPlatform(), chmodOwnerOnly(), clients, companionUrl(), computeAcceptKey() (+47 more)

### Community 2 - "models/index.tsx"
Cohesion: 0.13
Nodes (17): Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle(), DropdownMenu() (+9 more)

### Community 3 - "evaluations.ts"
Cohesion: 0.08
Nodes (39): createEvaluationEvaluationsPost(), CreateEvaluationEvaluationsPostMutationBody, CreateEvaluationEvaluationsPostMutationError, CreateEvaluationEvaluationsPostMutationResult, exportReportPdfEvaluationsEvaluationIdReportPdfPost(), ExportReportPdfEvaluationsEvaluationIdReportPdfPostMutationError, ExportReportPdfEvaluationsEvaluationIdReportPdfPostMutationResult, getCreateEvaluationEvaluationsPostMutationOptions() (+31 more)

### Community 4 - "evaluations.zod.ts"
Cohesion: 0.05
Nodes (37): CreateEvaluationEvaluationsPostBody, createEvaluationEvaluationsPostBodyAgeMax, createEvaluationEvaluationsPostBodyCaMax, createEvaluationEvaluationsPostBodyCaMin, createEvaluationEvaluationsPostBodyCholExclusiveMin, createEvaluationEvaluationsPostBodyCpMax, createEvaluationEvaluationsPostBodyExangMax, createEvaluationEvaluationsPostBodyExangMin (+29 more)

### Community 5 - "routeTree.gen.ts"
Cohesion: 0.08
Nodes (27): RequirePatientGuard(), RequirePatientGuardProps, queryClient, router, Route, Route, Route, Route (+19 more)

### Community 6 - "dashboard.ts"
Cohesion: 0.06
Nodes (50): DashboardHeader(), ModelInfo(), COLORS, LABELS, RiskDistribution(), RiskFactors(), StatCardsRow(), ContributingFactors() (+42 more)

### Community 7 - "scripts"
Cohesion: 0.06
Nodes (31): concurrently, devDependencies, concurrently, tailwindcss-animate, tailwindcss-animate, name, private, scripts (+23 more)

### Community 8 - "CardioPredict — Guia de Desenvolvimento"
Cohesion: 0.14
Nodes (13): Backend (`apps/server`), Banco de Dados (Migrations), CardioPredict — Guia de Desenvolvimento, Convenções de Código, 📂 Estrutura do Projeto, Execução, ⚙️ Fluxo de Trabalho, Frontend (`apps/web`) (+5 more)

### Community 9 - "form-wizard.tsx"
Cohesion: 0.15
Nodes (18): selectedPatientAtom, DEFAULT_VALUES_FORM, EvaluationForm(), FormData, PatientFiltersProps, Input(), Select(), SelectContent() (+10 more)

### Community 10 - "schemas/dashboard.py"
Cohesion: 0.13
Nodes (24): _classify_risk(), get_risk_distribution(), get_risk_factors(), get_stats(), get, Session, get_metrics(), list_features() (+16 more)

### Community 11 - "models.ts"
Cohesion: 0.08
Nodes (34): sidebarOpenAtom, MainLayout(), navItems, Sidebar(), Toaster(), getGetMetricsModelsModelIdMetricsGetQueryKey(), getGetMetricsModelsModelIdMetricsGetQueryOptions(), getListFeaturesModelsFeaturesGetQueryKey() (+26 more)

### Community 12 - "compilerOptions"
Cohesion: 0.08
Nodes (25): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, ignoreDeprecations, jsx, lib, module (+17 more)

### Community 13 - "patients.ts"
Cohesion: 0.06
Nodes (37): PatientForm(), PatientTablePaginationProps, createPatientPatientsPost(), CreatePatientPatientsPostMutationBody, CreatePatientPatientsPostMutationError, CreatePatientPatientsPostMutationResult, getCreatePatientPatientsPostMutationOptions(), getGetPatientPatientsPatientIdGetQueryKey() (+29 more)

### Community 14 - "reports.ts"
Cohesion: 0.11
Nodes (22): exportReportReportsExportPost(), ExportReportReportsExportPostMutationBody, ExportReportReportsExportPostMutationError, ExportReportReportsExportPostMutationResult, getExportReportReportsExportPostMutationOptions(), getGetReportReportsReportIdGetQueryKey(), getGetReportReportsReportIdGetQueryOptions(), getListReportsReportsGetQueryKey() (+14 more)

### Community 15 - "patients.py"
Cohesion: 0.33
Nodes (8): create_patient(), get_patient(), list_patients(), get, post, Session, UUID, PatientCreate

### Community 16 - "patient-form.tsx"
Cohesion: 0.24
Nodes (7): PatientFormData, Label(), Segmented(), SegmentedMulti(), SegmentedMultiProps, SegmentedOption, SegmentedProps

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

### Community 23 - "patients/index.tsx"
Cohesion: 0.17
Nodes (9): usePatientColumns(), PatientFilters(), PatientTablePagination(), Badge(), badgeVariants, Button(), buttonVariants, ListPatientsPatientsGetParams (+1 more)

### Community 24 - "ADDED Requirements"
Cohesion: 0.11
Nodes (17): ADDED Requirements, Requirement: Avaliação usa paciente pré-cadastrado, Requirement: Ação "Nova Avaliação" na listagem de pacientes, Requirement: Estado de paciente selecionado na sessão, Requirement: Select de paciente na tela de avaliação, Requirement: Seleção de paciente como pré-condição para avaliação, Requirement: Unificação do endpoint de predição, Scenario: Acesso com paciente selecionado (+9 more)

### Community 25 - "cn"
Cohesion: 0.09
Nodes (22): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+14 more)

### Community 26 - "Requirement: Replace custom UI components with shadcn equivalents"
Cohesion: 0.12
Nodes (16): ADDED Requirements, Requirement: Initialize shadcn/ui with Tailwind CSS v4, Requirement: Map existing design tokens to shadcn CSS variables, Requirement: Preserve existing component behavior and interfaces, Requirement: Remove redundant Radix UI peer dependencies, Requirement: Replace custom UI components with shadcn equivalents, Scenario: CSS variables match existing palette, Scenario: No breaking import changes (+8 more)

### Community 27 - "useListEvaluationsEvaluationsGet"
Cohesion: 0.40
Nodes (5): getListEvaluationsEvaluationsGetQueryKey(), getListEvaluationsEvaluationsGetQueryOptions(), listEvaluationsEvaluationsGet(), useListEvaluationsEvaluationsGet(), ResultsPage()

### Community 28 - "patients.zod.ts"
Cohesion: 0.12
Nodes (15): CreatePatientPatientsPostBody, createPatientPatientsPostBodyAgeMax, createPatientPatientsPostBodyNameOneMax, createPatientPatientsPostBodySexMax, createPatientPatientsPostBodySexMin, CreatePatientPatientsPostResponse, GetPatientPatientsPatientIdGetParams, GetPatientPatientsPatientIdGetResponse (+7 more)

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

### Community 33 - "results/index.tsx"
Cohesion: 0.24
Nodes (8): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle(), ListEvaluationsEvaluationsGetParams

### Community 34 - "api"
Cohesion: 0.23
Nodes (12): getHomeGetQueryKey(), getHomeGetQueryOptions(), homeGet(), HomeGetQueryError, HomeGetQueryResult, SecondParameter, useHomeGet(), withQueryKey() (+4 more)

### Community 35 - "Requirement: Constants module provides typed accessors"
Cohesion: 0.14
Nodes (13): ADDED Requirements, Requirement: Constants module provides typed accessors, Requirement: feature_analysis.py consumes constants module, Requirement: Feature metadata is stored in a config file, Scenario: calculate_contributing_factors uses units and labels from config, Scenario: calculate_feature_importance uses display names from config, Scenario: Config file contains categorical feature entries, Scenario: Config file contains continuous feature entries (+5 more)

### Community 36 - "Writing Plans"
Cohesion: 0.15
Nodes (12): Bite-Sized Task Granularity, Execution Handoff, File Structure, No Placeholders, Overview, Plan Document Header, Remember, Scope Check (+4 more)

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
Cohesion: 0.33
Nodes (9): balance_smote(), binarize_target(), encode_categorical(), fill_missing(), limit_outliers(), load_data(), prepare_data(), PreparedData (+1 more)

### Community 43 - "dependencies"
Cohesion: 0.18
Nodes (11): dependencies, axios, @hookform/resolvers, tailwindcss, @tanstack/react-query-devtools, @tanstack/react-router, axios, @hookform/resolvers (+3 more)

### Community 44 - "devDependencies"
Cohesion: 0.18
Nodes (11): devDependencies, dotenv, @tanstack/router-plugin, typescript, typescript-eslint, vite, dotenv, @tanstack/router-plugin (+3 more)

### Community 45 - "Web — Frontend de Avaliação de Risco Cardíaco"
Cohesion: 0.18
Nodes (10): Backend, Estrutura, Geração de API, Instalação, Licença, Pré-requisitos, Rotas, Scripts (+2 more)

### Community 46 - ".claude/skills/openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 47 - ".opencode/skills/openspec-explore/SKILL.md"
Cohesion: 0.18
Nodes (10): Check for context, Ending Discovery, Guardrails, Handling Different Entry Points, OpenSpec Awareness, The Stance, What You Don't Have To Do, What You Might Do (+2 more)

### Community 48 - "FastAPI"
Cohesion: 0.38
Nodes (5): lifespan(), documentation_scalar(), home(), get, FastAPI

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

### Community 57 - "base.py"
Cohesion: 0.28
Nodes (4): Base, Model, Patient, DeclarativeBase

### Community 58 - "connection.py"
Cohesion: 0.21
Nodes (4): create_tables(), evaluate(), train_model(), main()

### Community 59 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, format, format:fix, generate:api, lint, preview (+1 more)

### Community 60 - "ADDED Requirements"
Cohesion: 0.22
Nodes (8): ADDED Requirements, Requirement: Botão "Novo Paciente" funcional, Requirement: Navegação lateral incluir cadastro de paciente, Requirement: Tela de cadastro de paciente, Scenario: Cadastrar paciente com sucesso, Scenario: Cadastrar paciente sem nome, Scenario: Clicar em Novo Paciente, Scenario: Idade inválida

### Community 61 - "Implementation Patterns"
Cohesion: 0.25
Nodes (7): fastapi-templates — detailed worked examples, Implementation Patterns, Pattern 1: Complete FastAPI Application, Pattern 2: CRUD Repository Pattern, Pattern 3: Service Layer, Pattern 4: API Endpoints with Dependencies, Pattern 5: Authentication & Authorization

### Community 62 - "prediction_service.py"
Cohesion: 0.50
Nodes (7): assemble_features(), _available_models(), get_default_model_id(), _get_model_by_id(), predict(), Session, Patient

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

### Community 75 - "env.py"
Cohesion: 0.40
Nodes (4): Run migrations in 'offline' mode. This configures the context with just a URL…, Run migrations in 'online' mode. In this scenario we need to create an Engine…, run_migrations_offline(), run_migrations_online()

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

### Community 82 - "opencode.json"
Cohesion: 0.50
Nodes (3): plugin, $schema, .opencode/plugins/graphify.js

### Community 83 - "2026-07-09-extract-feature-config/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Create config file, 2. Create constants module, 3. Refactor feature_analysis.py

### Community 84 - "2026-07-09-integrate-shadcn-ui/tasks.md"
Cohesion: 0.50
Nodes (3): 1. Setup & Initialization, 2. Component Replacement, 3. Cleanup & Verification

## Knowledge Gaps
- **643 isolated node(s):** `📌 Visão Geral`, `Backend (`apps/server`)`, `Frontend (`apps/web`)`, `Execução`, `Machine Learning` (+638 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **54 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `results/index.tsx`, `models/index.tsx`, `dashboard.ts`, `form-wizard.tsx`, `models.ts`, `patient-form.tsx`, `patients/index.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `api()` connect `api` to `evaluations.ts`, `dashboard.ts`, `models.ts`, `patients.ts`, `reports.ts`, `useListEvaluationsEvaluationsGet`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `devDependencies` to `eslint-plugin-prettier`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `orval`, `prettier`, `prettier-plugin-tailwindcss`, `@types/node`, `@types/react`, `@types/react-dom`, `@vitejs/plugin-react`, `web/package.json`, `eslint`, `eslint-config-prettier`, `@eslint/js`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Are the 3 inferred relationships involving `ReportPDF` (e.g. with `Evaluation` and `ContributingFactor`) actually correct?**
  _`ReportPDF` has 3 INFERRED edges - model-reasoned connections that need verification._
- **What connects `📌 Visão Geral`, `Backend (`apps/server`)`, `Frontend (`apps/web`)` to the rest of the system?**
  _643 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `ReportPDF` be split into smaller, more focused modules?**
  _Cohesion score 0.05640203154236835 - nodes in this community are weakly interconnected._
- **Should `server.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.05868118572292801 - nodes in this community are weakly interconnected._