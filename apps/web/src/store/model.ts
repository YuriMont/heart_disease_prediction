import { atom } from "jotai"
import type { ModelInfo } from "../generated/models";

export const modelAtom = atom<ModelInfo | null>(null);