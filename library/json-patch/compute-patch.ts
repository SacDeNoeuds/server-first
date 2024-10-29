import { diff, jsonPatchPathConverter } from "just-diff"
import type { JsonPatch } from "./operation"

export type DiffAble =
  | unknown[]
  | Record<PropertyKey, unknown>
  | null
  | undefined
export const computePatch = (
  original: DiffAble,
  updated: DiffAble,
): JsonPatch => {
  if (!original || !updated)
    return updated === original
      ? []
      : [{ op: "replace", path: "", value: updated }]
  return diff(original, updated, jsonPatchPathConverter)
}
