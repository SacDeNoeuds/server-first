import { diffApply, jsonPatchPathConverter } from "just-diff-apply"
import type { JsonPatch } from "./operation"

export const applyPatch = <T extends object>(
  original: T,
  patch: JsonPatch,
): T => {
  diffApply(original, patch as any, jsonPatchPathConverter)
  return original // mutated…
}
