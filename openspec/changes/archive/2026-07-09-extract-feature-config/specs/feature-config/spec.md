## ADDED Requirements

### Requirement: Feature metadata is stored in a config file
The system SHALL define all feature metadata in a single `features.json` config file located at `apps/server/src/services/constants/features.json`.

#### Scenario: Config file exists and is valid JSON
- **WHEN** `features.json` is loaded
- **THEN** it SHALL parse as valid JSON without errors

#### Scenario: Config file contains continuous feature entries
- **WHEN** reading a continuous feature entry (e.g., `age`, `trestbps`)
- **THEN** it SHALL contain fields: `display_name` (str), `unit` (str), `type` = "continuous"

#### Scenario: Config file contains categorical feature entries
- **WHEN** reading a categorical feature entry (e.g., `cp`, `thal`)
- **THEN** it SHALL contain fields: `display_name` (str), `type` = "categorical", `categories` (dict mapping int/float values to label strings)

### Requirement: Constants module provides typed accessors
The system SHALL provide a `constants.py` module at `apps/server/src/services/constants.py` that loads `features.json` and exposes accessors using a Pydantic model.

#### Scenario: Load and retrieve a display name
- **WHEN** calling `get_display_name("age")`
- **THEN** it SHALL return `"Age"`

#### Scenario: Load and retrieve a unit for a continuous feature
- **WHEN** calling `get_unit("trestbps")`
- **THEN** it SHALL return `"mmHg"`

#### Scenario: Load and retrieve category labels for a categorical feature
- **WHEN** calling `get_categories("cp")`
- **THEN** it SHALL return `{1: "Typical", 2: "Atypical", 3: "Non-anginal", 4: "Asymptomatic"}`

#### Scenario: Unknown feature key returns None
- **WHEN** calling any accessor with a key not in the config
- **THEN** it SHALL return `None` (not raise)

### Requirement: feature_analysis.py consumes constants module
`feature_analysis.py` SHALL import display names, units, and category labels from `constants.py` instead of inline dicts.

#### Scenario: calculate_feature_importance uses display names from config
- **WHEN** `calculate_feature_importance()` builds its result
- **THEN** the `variable` field in each `FeatureImportance` SHALL use the `display_name` from config

#### Scenario: calculate_contributing_factors uses units and labels from config
- **WHEN** `calculate_contributing_factors()` builds its result
- **THEN** `_add_continuous_factor` SHALL receive `unit` from config
- **THEN** `_add_category_factor` SHALL receive the `name_map` from config