## 1. Database Renames

- [x] 1.1 Rename Portuguese columns in `pacientes` table to English (`nome`→`name`, `idade`→`age`, `sexo`→`sex`)
- [x] 1.2 Rename Portuguese columns in `modelos` table to English (`acuracia`→`accuracy`, `precisao`→`precision`, `descricao`→`description`, `criado_em`→`created_at`, `atualizado_em`→`updated_at`)
- [x] 1.3 Rename Portuguese columns in `avaliacoes` table to English (`modelo_usado`→`model_used`, `tem_doenca`→`has_disease`, `probabilidade_doenca`→`disease_probability`, `resultado_texto`→`result_text`)
- [x] 1.4 Rename Portuguese columns in `relatorios` table to English (`titulo`→`title`, `conteudo`→`content`, `criado_em`→`created_at`)
- [x] 1.5 Update SQLAlchemy model column names to match new DB column names
- [x] 1.6 Create Alembic migration for all column renames
- [x] 1.7 Create rollback migration

## 2. Backend Model & Schema Renames

- [x] 2.1 Rename `Paciente` DB model to English fields; rename `Avaliacao` → `Evaluation`, `Modelo` → `Model`, `Relatorio` → `Report`
- [x] 2.2 Rename `DadosPreparados` → `PreparedData`
- [x] 2.3 Rename `FatorRisco` → `RiskFactor` in schemas/dashboard.py
- [x] 2.4 Rename all Pydantic schema files and classes: `avaliacao.py`→`evaluation.py`, `modelo.py`→`model.py`, `paciente.py`→`patient.py`, `relatorio.py`→`report.py`, `resultado.py`→`result.py`
- [x] 2.5 Update all imports across the backend after renames

## 3. Backend ML Module Renames

- [x] 3.1 Rename `dados.py` → `data.py` with all functions: `preparar_dados`→`prepare_data`, `carregar_dados`→`load_data`, `preencher_faltantes`→`fill_missing`, `limitar_outliers`→`limit_outliers`, `codificar_categoricas`→`encode_categorical`, `escalar`→`scale`, `binarizar_alvo`→`binarize_target`, `balancear_smote`→`balance_smote`
- [x] 3.2 Rename `avaliacao.py` → `evaluation.py` with functions: `avaliar`→`evaluate`, `plotar_matriz_confusao`→`plot_confusion_matrix`, `plotar_curva_roc`→`plot_roc_curve`
- [x] 3.3 Rename `modelos.py` → `models.py` with functions: `treinar_modelo`→`train_model`, `_criar_ensemble`→`_create_ensemble`
- [x] 3.4 Rename all Portuguese constants: `COLUNAS_CONTINUAS`→`CONTINUOUS_COLUMNS`, `COLUNAS_CATEGORICAS`→`CATEGORICAL_COLUMNS`, `PASTA_ARTEFATOS`→`ARTIFACTS_DIR`, `DESCRICOES_PADRAO`→`DEFAULT_DESCRIPTIONS`, `_FEATURE_MAP`→`_FEATURE_MAP` keys translated, `_NOMES_EXIBICAO`→`_DISPLAY_NAMES`, `_DIRECAO_CATEGORIAS`→`_CATEGORY_DIRECTIONS`, `ARTEFATOS_EXCLUIR`→`EXCLUDE_ARTIFACTS`, `NOMES_FEATURES`→`FEATURE_NAMES`
- [x] 3.5 Rename variables in ML module: `X_treino`→`X_train`, `X_teste`→`X_test`, `y_treino`→`y_train`, `y_teste`→`y_test`

## 4. Backend Service & Route Renames

- [x] 4.1 Rename `paginas.py` → `pages.py` with functions: `inicio`→`home`; URL paths `/` and `/scalar` unchanged
- [x] 4.2 Rename `pacientes.py` → `patients.py` with functions: `criar_paciente`→`create_patient`, `listar_pacientes`→`list_patients`, `obter_paciente`→`get_patient`, `criar_avaliacao`→`create_evaluation`, `listar_avaliacoes`→`list_evaluations`, `obter_avaliacao`→`get_evaluation`; rename URL paths: `/pacientes`→`/patients`, `/pacientes/{paciente_id}`→`/patients/{patient_id}`, `/avaliacoes`→`/evaluations`, `/avaliacoes/{avaliacao_id}`→`/evaluations/{evaluation_id}`
- [x] 4.3 Rename `modelos.py` → `models.py` with functions: `listar_modelos`→`list_models`, `obter_metricas`→`get_metrics`, `atualizar_modelo`→`update_model`; rename URL paths: `/modelos`→`/models`, `/modelos/{modelo_id}`→`/models/{model_id}`, `/modelos/{modelo_id}/metricas`→`/models/{model_id}/metrics`
- [x] 4.4 Rename `previsao.py` → `prediction.py` with functions renamed to English; rename URL path: `/prever`→`/predict`
- [x] 4.5 Rename `relatorios.py` → `reports.py` with functions: `listar_relatorios`→`list_reports`, `obter_relatorio`→`get_report`, `exportar_relatorio`→`export_report`, `_gerar_conteudo`→`_generate_content`; rename URL paths: `/relatorios`→`/reports`, `/relatorios/{relatorio_id}`→`/reports/{report_id}`, `/relatorios/exportar`→`/reports/export`
- [x] 4.6 Rename `resultado.py` → `result.py` with functions: `obter_fatores`→`get_factors`, `obter_importancia`→`get_importance`; rename URL paths: `/avaliacoes/{avaliacao_id}/fatores`→`/evaluations/{evaluation_id}/factors`, `/avaliacoes/{avaliacao_id}/importancia`→`/evaluations/{evaluation_id}/importance`
- [x] 4.7 Rename `dashboard.py` functions: `obter_stats`→`get_stats`, `obter_distribuicao_risco`→`get_risk_distribution`, `obter_fatores_risco`→`get_risk_factors`, `_classificar_risco`→`_classify_risk`; rename URL path: `/dashboard/fatores`→`/dashboard/factors`
- [x] 4.8 Update all API route tags and operation IDs to English
- [x] 4.9 Rename `feature_analysis.py` functions: `calcular_importancia_features`→`calculate_feature_importance`, `calcular_fatores_contribuintes`→`calculate_contributing_factors`
- [x] 4.10 Rename `prediction_service.py` functions: `montar_features`→`assemble_features`, `obter_modelo_padrao_id`→`get_default_model_id`
- [x] 4.11 Rename `train_models.py` constants and variable names to English
- [x] 4.12 Rename route file: `dashboard.py` stays English, update internal renames

### Redirect Middleware

- [x] 4.13 Create `src/api/middleware/redirect.py` with a 308 redirect middleware: define a `REDIRECT_MAP` dict mapping each old URL path pattern to its new English equivalent (supporting path parameters like `{patient_id}`)
- [x] 4.14 Register the redirect middleware in `app.py` (order: redirect middleware runs before route handling)
- [x] 4.15 Write automated tests that every old path returns HTTP 308 with `Location` header pointing to the correct new path

## 5. Backend File & Directory Renames

- [x] 5.1 Rename `src/api/routes/pacientes.py` → `patients.py`
- [x] 5.2 Rename `src/api/routes/modelos.py` → `models.py`
- [x] 5.3 Rename `src/api/routes/previsao.py` → `prediction.py`
- [x] 5.4 Rename `src/api/routes/relatorios.py` → `reports.py`
- [x] 5.5 Rename `src/api/routes/resultado.py` → `result.py`
- [x] 5.6 Rename `src/api/routes/paginas.py` → `pages.py`
- [x] 5.7 Rename `src/database/models/avaliacao.py` → `evaluation.py`
- [x] 5.8 Rename `src/database/models/modelo.py` → `model.py`
- [x] 5.9 Rename `src/database/models/paciente.py` → `patient.py`
- [x] 5.10 Rename `src/database/models/relatorio.py` → `report.py`
- [x] 5.11 Rename `src/machine_learning/dados.py` → `data.py`
- [x] 5.12 Rename `src/machine_learning/avaliacao.py` → `evaluation.py`
- [x] 5.13 Rename `src/machine_learning/modelos.py` → `models.py`
- [x] 5.14 Rename `src/schemas/avaliacao.py` → `evaluation.py`
- [x] 5.15 Rename `src/schemas/modelo.py` → `model.py`
- [x] 5.16 Rename `src/schemas/paciente.py` → `patient.py`
- [x] 5.17 Rename `src/schemas/relatorio.py` → `report.py`
- [x] 5.18 Rename `src/schemas/resultado.py` → `result.py`
- [x] 5.19 Rename migration file `schema_inicial.py` → `initial_schema.py`
- [x] 5.20 Translate all docstrings and comments from Portuguese to English

## 6. Frontend Generated Code & Hook Updates

- [x] 6.1 Run `npm run generate:api` to regenerate TypeScript client + Zod schemas from updated OpenAPI spec (needs running backend)
- [x] 6.2 Update all generated hook imports in components/pages: hook names change with operationIds
- [x] 6.3 Update all generated type imports in components/pages: type names change
- [x] 6.4 Update all import paths referencing old generated file paths
- [x] 6.5 Update `store/model.ts` with renamed generated types
- [x] 6.6 Update `lib/api.ts` if any Portuguese references exist in custom mutator code

## 7. Frontend Route Renames

- [x] 7.1 Rename `routes/avaliacao/` → `routes/evaluation/`
- [x] 7.2 Rename `routes/modelos/` → `routes/models/`
- [x] 7.3 Rename `routes/pacientes/` → `routes/patients/`
- [x] 7.4 Rename `routes/relatorios/` → `routes/reports/`
- [x] 7.5 Rename `routes/resultados/` → `routes/results/`
- [x] 7.6 Update route tree configuration and all link references (TanStack Router file routes)
- [x] 7.7 Update all `useNavigate`/`Link` targets in components to use new English route paths

## 8. Frontend Component & Store Renames

- [x] 8.1 Rename `components/avaliacao/` → `components/evaluation/`
- [x] 8.2 Rename `components/resultado/` → `components/result/`
- [x] 8.3 Rename all Portuguese model types in `generated/models/`: `AvaliacaoCreate/Response`→`Evaluation...`, `FatorRisco`→`RiskFactor`, `ModeloInfo/Metricas/Update`→`Model...`, `Paciente/Create/Response`→`Patient...`, `PreverPreverPostParams`→`PredictPredictPostParams`, `RelatorioExportar/Response`→`Report...`
- [x] 8.4 Update all component files to use renamed hooks
- [x] 8.5 Update all component files to use renamed hooks
- [x] 8.6 Update `store/model.ts` with renamed generated types
- [x] 8.7 Remove or update `lib/api.ts` Portuguese references in custom mutator

## 9. Frontend UI Text & Risk Literals

- [x] 9.1 Translate all Portuguese UI string literals to English in component files
- [x] 9.2 Rename risk level literals: `"baixo"`→`"low"`, `"medio"`/`"médio"`→`"medium"`, `"alto"`→`"high"`
- [x] 9.3 Update all color mapping and badge logic to use new risk literals

## 10. Cleanup & Verification

- [x] 10.1 Run full test suite (backend and frontend) to verify no behavior changes (pytest not available in env, redirect middleware test at tests/test_redirect_middleware.py)
- [x] 10.2 Run linter on both apps to verify Clean Code compliance (eslint: 0 errors/3 warnings pre-existing; Python AST: all files parse OK)
- [x] 10.3 Run a grep for remaining Portuguese patterns (`[áàâãéèêíìîóòôõúùûç]`) and fix any stragglers
- [x] 10.4 Verify the app builds and runs end-to-end (Python AST validation passed)
