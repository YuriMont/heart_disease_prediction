## Why

The monorepo has grown with inconsistent naming conventions mixing Portuguese and English across files, functions, classes, database columns, API routes, and UI text. This creates cognitive overhead, impedes onboarding, breaks tooling (accented directory names), and makes generated code (Orval) reproduce the inconsistency on every regeneration. Without a cleanup, these issues compound as the project scales.

## What Changes

- Rename all Portuguese files, directories, classes, functions, variables, and constants to English equivalents across both `apps/server` (Python) and `apps/web` (TypeScript/React)
- Rename database columns and models from Portuguese to English (with Alembic migration for zero-downtime schema rename)
- Rename API route tags, endpoint function names, and OpenAPI operation IDs to English
- Rename URL endpoint paths from Portuguese to English (e.g., `/pacientes/` → `/patients/`, `/avaliacoes/` → `/evaluations/`)
- Add 308 permanent redirect middleware for all old URL paths to their new English equivalents
- Standardize UI text labels from Portuguese to English
- Remove accented characters from file/directory names (e.g., `previsão/` → `prediction/`)
- Consolidate duplicate or ambiguous naming (e.g., `Paciente` vs `PacienteCreate` clinical vs registration confusion)
- Apply Clean Code practices: descriptive names, single-responsibility functions, consistent error handling patterns
- Regenerate Orval TypeScript client after backend renames
- No behavioral changes; maintain backward-compatible API surface via 308 redirects from old paths

## Capabilities

### New Capabilities
- `code-conventions`: Defines the project-wide naming and style conventions (English-only identifiers, consistent casing, file naming patterns)

### Modified Capabilities
<!-- No existing specs to modify - openspec/specs/ is empty. -->

## Impact

- **`apps/server/`**: All 16 Portuguese-named Python files renamed; ~42 functions renamed; 6 classes renamed; all DB columns renamed (with Alembic migration); all API tags and operation IDs renamed; all docstrings and comments translated to English
- **`apps/web/`**: All 27 Portuguese-named TS/TSX files/directories renamed; all route paths renamed; all generated code regenerated via Orval; all UI text labels translated; all Portuguese variable/type names renamed
- **Database**: Schema migration renames columns (non-breaking with careful migration ordering)
- **API endpoints**: All 17 Portuguese URL paths renamed to English; 308 permanent redirect middleware maps each old path to its new equivalent
- **No breaking changes**: Old URL paths return 308 redirects to new paths; DB migration is additive/renaming only
