import json
import os
from typing import Any

from pydantic import BaseModel, Field


class FeatureConfig(BaseModel):
    type: str = Field(pattern=r"^(continuous|categorical)$")
    display_name: str
    unit: str | None = None
    categories: dict[str, str] | None = None


class FeaturesConfig(BaseModel):
    features: dict[str, FeatureConfig]


_CONFIG_DIR = os.path.dirname(os.path.abspath(__file__))
_CONFIG_PATH = os.path.join(_CONFIG_DIR, "features.json")

with open(_CONFIG_PATH) as f:
    _raw = json.load(f)

_config = FeaturesConfig(features={k: FeatureConfig(**v) for k, v in _raw.items()})


def get_display_name(key: str) -> str | None:
    feat = _config.features.get(key)
    return feat.display_name if feat else None


def get_unit(key: str) -> str | None:
    feat = _config.features.get(key)
    return feat.unit if feat else None


def get_continuous_keys() -> list[str]:
    return [k for k, v in _config.features.items() if v.type == "continuous"]


def get_categorical_keys() -> list[str]:
    return [k for k, v in _config.features.items() if v.type == "categorical"]


def get_categories(key: str) -> dict[int | float, str] | None:
    feat = _config.features.get(key)
    if feat is None or feat.categories is None:
        return None
    return {_parse_key(k): v for k, v in feat.categories.items()}


def _parse_key(k: str) -> int | float:
    try:
        return int(k)
    except ValueError:
        return float(k)