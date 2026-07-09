## Why

The `feature_analysis.py` module has hardcoded mappings for feature names, display names, one-hot column groupings, and category directions. This creates maintenance burden, fragile coupling to the training pipeline's encoding scheme, and makes it impossible to support multiple model types without mock data. By extracting these into config files and a constants module, the system becomes data-driven and resilient to encoding changes.

## What Changes

- Extract `_FEATURE_MAP`, `_DISPLAY_NAMES`, and category metadata from `feature_analysis.py` into structured config files (JSON/YAML)
- Create a `constants.py` module as a single source of truth for feature metadata
- Replace the hardcoded `_CATEGORY_DIRECTIONS` dict with dynamically-loaded config
- Remove the `_find_onehot` function (already unused after previous refactor)
- Keep `_build_feature_map()` as a fallback derivation from `FEATURE_NAMES` for when no config override exists

## Capabilities

### New Capabilities
- `feature-config`: Centralized configuration for feature metadata (display names, units, category values, models list)

### Modified Capabilities
*(none — no existing specs cover feature_analysis)*

## Impact

- `apps/server/src/services/feature_analysis.py` — remove hardcoded dicts, load from config
- `apps/server/src/services/constants.py` — new file with feature metadata registry
- `apps/server/src/config/features.json` — new config file with all feature definitions
- No API changes, no database changes, no breaking changes to consumers