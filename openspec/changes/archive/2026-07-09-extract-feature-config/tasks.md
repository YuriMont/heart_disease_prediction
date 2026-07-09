## 1. Create config file

- [x] 1.1 Create `apps/server/src/services/constants/` directory
- [x] 1.2 Create `features.json` with entries for all 13 features — continuous features get `display_name`, `unit`, `type: "continuous"`; categorical features get `display_name`, `type: "categorical"`, `categories` map

## 2. Create constants module

- [x] 2.1 Create `apps/server/src/services/constants.py` with a Pydantic model (`FeatureConfig`, `FeaturesConfig`) that loads and validates `features.json`
- [x] 2.2 Expose `get_display_name(key)`, `get_unit(key)`, `get_categories(key)` functions that return `None` for unknown keys

## 3. Refactor feature_analysis.py

- [x] 3.1 Replace inline `_DISPLAY_NAMES` with import from `constants.get_display_name`
- [x] 3.2 Replace hardcoded unit strings in `_add_continuous_factor` calls with `get_unit()` lookups
- [x] 3.3 Replace inline category `name_map` dicts in `_add_category_factor` calls with `get_categories()` lookups
- [x] 3.4 Verify no hardcoded display names, units, or category maps remain in `feature_analysis.py`