import { atom } from "jotai"
import type { ModeloInfo } from "../generated/models";

export const modelAtom = atom<ModeloInfo | null>(null);