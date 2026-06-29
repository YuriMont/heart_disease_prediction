## ADDED Requirements

### Requirement: English-only identifiers
All source code identifiers SHALL use English words only. This includes:
- Python: classes, functions, variables, constants, module names, package names
- TypeScript/TSX: classes, functions, variables, constants, types, interfaces, enums, module names
- Database: table names, column names, index names
- API: route tags, operation IDs, endpoint function names, URL endpoint paths
- Configuration: environment variable names, script names

#### Scenario: All identifiers are in English
- **WHEN** scanning all `.py`, `.ts`, `.tsx` files for non-English words in identifiers
- **THEN** no Portuguese or other non-English identifiers SHALL be found

### Requirement: File and directory names in English
All file and directory names SHALL use English kebab-case. Accented characters SHALL NOT appear in any path. Generated files (e.g., Orval output) are exempt but their source of truth (the OpenAPI spec) MUST be fixed.

#### Scenario: No accented paths
- **WHEN** listing all files in the repository
- **THEN** no file or directory name SHALL contain accented characters (`[áàâãéèêíìîóòôõúùûç]`)

#### Scenario: All file and directory names are English
- **WHEN** inspecting all source file and directory names in `apps/`
- **THEN** all names SHALL use English words

### Requirement: Consistent casing conventions
Python code SHALL follow PEP 8 (snake_case for functions/variables, PascalCase for classes, UPPER_CASE for constants). TypeScript/React code SHALL follow the project conventions (camelCase for variables/functions, PascalCase for components/types/interfaces, kebab-case for files). API URL endpoint paths SHALL use kebab-case in English (e.g., `/risk-factors` not `/risk_factors` or `/fatores_de_risco`).

#### Scenario: Python casing is PEP 8 compliant
- **WHEN** linting Python source files with a PEP 8 style checker
- **THEN** no casing violations SHALL be reported

#### Scenario: TypeScript casing is consistent
- **WHEN** linting TypeScript source files
- **THEN** casing SHALL follow project conventions

### Requirement: UI text in English
All user-facing text strings in the web application SHALL be in English. This includes labels, placeholders, error messages, tooltips, and notifications.

#### Scenario: UI text is English
- **WHEN** extracting all string literals from `.tsx` files
- **THEN** all user-facing text SHALL be in English

### Requirement: Comments and docstrings in English
All source code comments and docstrings SHALL be written in English. Technical documentation in docstrings SHALL describe purpose and behavior clearly.

#### Scenario: All comments are English
- **WHEN** scanning source files for comment blocks
- **THEN** all comments SHALL use English

### Requirement: Backward-compatible naming
When renaming API operation IDs, tags, or URL paths, the OpenAPI spec SHALL be updated. Old operation IDs SHALL NOT be kept as duplicates. Old URL paths SHALL be preserved via 308 permanent redirect middleware that maps each old path to its new English equivalent. The redirect map SHALL be maintained in a single file and tested. If any renaming affects external consumers, a deprecation notice SHALL be documented.

#### Scenario: API contract is preserved
- **WHEN** comparing HTTP endpoints before and after the refactor
- **THEN** all HTTP methods, request/response schemas SHALL remain identical
- **WHEN** a request is made to an old Portuguese URL path
- **THEN** the server SHALL respond with HTTP 308 and a `Location` header pointing to the new English URL path
- **WHEN** a consumer relies on old operation ID values
- **THEN** the consumer SHALL update to use new operation IDs
