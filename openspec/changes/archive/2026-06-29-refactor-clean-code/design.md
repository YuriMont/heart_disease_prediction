## Context

The monorepo (CardioPredict) has two apps: `apps/server` (Python/FastAPI) and `apps/web` (TypeScript/React). The backend defines the API OpenAPI spec in Portuguese (tags, operation IDs, model field names). The frontend's Orval-generated TypeScript client inherits this Portuguese naming. UI text, file names, directories, and database columns are also Portuguese, creating a mixed-language codebase.

The change is a cross-cutting, naming-only refactor — no new features, no behavioral changes. It requires careful coordination between backend, database, and frontend layers to avoid breaking the running application.

## Goals / Non-Goals

**Goals:**
- Standardize all code identifiers to English (files, dirs, classes, functions, variables, constants, types, interfaces)
- Rename database columns and tables from Portuguese to English (via Alembic migration)
- Rename API route tags, operation IDs, endpoint functions, and URL paths to English
- Add 308 permanent redirect middleware for backward compatibility of old URL paths
- Remove accented characters from all paths and filenames
- Translate all UI text labels from Portuguese to English
- Regenerate Orval TypeScript client after backend changes
- Establish a `code-conventions` spec documenting the naming rules

**Non-Goals:**
- No behavioral or logic changes — pure renaming/refactoring
- No database data migration (column renames only, data preserved)
- No architectural changes (no new packages, no module restructuring)
- No dependency upgrades or version bumps
- No test additions or removals
- No HTTP method or request/response schema changes (only URL paths are renamed, with 308 redirects preserving the old contract)

## Decisions

### 1. Rename strategy: bottom-up (DB → models → API → generated code)
**Why:** The database is the root of truth for model names. Renaming DB columns first, then SQLAlchemy models, then Pydantic schemas, then API routes, then the OpenAPI spec, then regenerating the frontend client ensures each layer builds on the previous one. Top-down would require fixing broken generated code at each step.

**Alternatives considered:**
- Top-down (API first): Would leave generated client broken during intermediate steps
- All at once in one PR: Too risky for review and debugging

### 2. Database migration: rename columns with Alembic, no data loss
**Why:** Alembic handles column renames natively (`alter_column`). Since this is development/pre-production, we rename in place. The migration renames columns and updates the model metadata. A rollback migration reverses the renames.

**Alternatives considered:**
- Add new columns, copy data, drop old ones: Safer for production zero-downtime, but overengineered for a research project
- SQLAlchemy column aliases only: Doesn't fix the DB schema, just the ORM layer

### 3. URL endpoint paths renamed with 308 permanent redirect middleware
**Why:** Consistent English naming across the entire API surface requires URL paths to also use English (e.g., `/pacientes/` → `/patients/`). Since URL paths are the public contract, old paths must continue to work for existing clients during the transition.

**Decision:** All Portuguese URL paths are renamed to English equivalents. A FastAPI middleware layer registers 308 Permanent Redirect responses for each old path → new path mapping. The middleware checks the request path against a static redirect table and returns a 308 redirect before the route handler is reached. This ensures:
- New code uses clean English paths
- Old clients (including any in-flight requests) are transparently redirected
- The redirect table is a single source of truth, easy to audit and remove in a future breaking release

**Alternatives considered:**
- Keep old and new routes side-by-side: Would double the route count and risk drift
- URL aliases via `app.include_router` with multiple prefixes: Messy with path parameters
- No backward compatibility: Too disruptive for a research project that may have active users

### 4. File renames: git-aware, separate commits per layer
**Why:** Git detects renames automatically with `git mv`. Doing renames in separate commits per logical layer (DB → models → API → frontend) preserves blame history and makes review feasible.

### 5. Frontend renaming: regenerate after backend, then manual cleanup
**Why:** Orval generates files from the OpenAPI spec. After backend renames, regeneration fixes most TypeScript files automatically. Remaining manual files (components, routes, store) are renamed separately. The Orval config's `output.works` keeps generated and manual code separate, making this clean.

## Risks / Trade-offs

- **[Generated code will be stale until regeneration]** → Order: rename backend → regenerate Orval → rename manual frontend files. Never leave stale generated code committed.
- **[DB migration could fail on rename]** → Migration is reversible; test on a copy of the DB first. Alembic `alter_column` is well-tested for SQLite.
- **[Large diff makes code review hard]** → Separate commits per layer (DB, models, API routes, ML module, frontend generated, frontend manual). Each commit is independently reviewable.
- **[Redirect mapping may miss edge cases]** → Each old path with path parameters (e.g., `/avaliacoes/{avaliacao_id}/fatores`) needs a corresponding redirect entry. Maintain the redirect table in a single file with automated tests that verify every old path returns 308 to the correct new path.
- **[Missed Portuguese strings in UI text]** → After manual pass, grep for remaining Portuguese words before declaring done. Use a script to scan for `[áàâãéèêíìîóòôõúùûç]` in `.tsx`/`.py` files.
- **[Orval regeneration may introduce formatting changes]** → Run `npm run format` or `prettier` after regeneration to keep consistent style.
