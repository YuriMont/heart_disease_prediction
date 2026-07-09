## Context

The `feature_analysis.py` service currently hardcodes:
- `_DISPLAY_NAMES` — mapping of raw feature keys to human-readable names
- Feature categories (which raw keys map to which one-hot columns) — partially replaced by `_build_feature_map()` but still referenced
- Metadata for continuous features (units) inlined in `calculate_contributing_factors`
- Metadata for categorical features (value-to-label maps) inlined per call

These are scattered across the module, duplicated knowledge that already exists in `machine_learning/data.py` (`CATEGORICAL_COLUMNS`, `CONTINUOUS_COLUMNS`) and the training pipeline (`drop_first=True` encoding). The one-hot grouping is now derived from `FEATURE_NAMES`, but display names, units, and category labels remain hardcoded.

## Goals / Non-Goals

**Goals:**
- Extract `_DISPLAY_NAMES`, unit strings, and category label maps into a single config file (`features.json`)
- Create `constants.py` module that loads config and provides typed accessors
- Make `feature_analysis.py` import from `constants.py` instead of inline dicts

**Non-Goals:**
- No change to the one-hot grouping logic (`_build_feature_map` stays)
- No change to the `_add_continuous_factor` / `_add_category_factor` algorithm
- No change to the prediction service or schemas
- No database changes

## Decisions

1. **JSON over YAML** — Python stdlib includes `json`, YAML requires a dependency. JSON is sufficient for this data shape and simpler to maintain.

2. **Single config file over split files** — All feature metadata (display names, units, category values) is small and co-located by feature key. Splitting would add complexity without benefit.

3. **`constants.py` as the loading layer** — A dedicated module loads `features.json`, validates it, and provides typed accessors. This keeps `feature_analysis.py` focused on analysis logic.

4. **`_build_feature_map` stays as fallback** — The one-hot column grouping is derivable from `FEATURE_NAMES` + `CATEGORICAL_COLUMNS` and doesn't benefit from config. Keeping it derived avoids drift.

## Risks / Trade-offs

- **Config drift** (JSON out of sync with training pipeline) → Mitigated by keeping one-hot grouping derived, not in config. Display names and labels change rarely.
- **File path coupling** → Config path is resolved relative to `constants.py` location, not CWD.
- **No type safety at load time** → Pydantic model validates the JSON schema at import.