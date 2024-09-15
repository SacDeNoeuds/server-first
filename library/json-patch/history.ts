import { applyPatch } from "./apply-patch"
import type { JsonPatch } from "./operation"

export type JsonPatchHistory = Array<{
  author: string
  date: Date
  patch: JsonPatch
}>

export function reconstructFromHistory<T>(
  history: JsonPatchHistory,
  options?: { until?: Date },
): T | undefined {
  const firstOp = history[0]?.patch[0]
  if (!firstOp) return undefined
  if (firstOp.path !== "" || (firstOp.op !== "replace" && firstOp.op !== "add"))
    throw new Error(
      'history must start with op { op: "replace" | "add", path: "", value: T }',
    )

  const initial = structuredClone(firstOp.value)
  const patch = history
    .flatMap(({ patch, date }) =>
      options?.until && date.valueOf() > options.until.valueOf() ? [] : patch,
    )
    .slice(1) // remove first op.

  return applyPatch(initial as object, patch) as T
}

export function addHistoryEntry(
  history: JsonPatchHistory,
  entry: JsonPatchHistory[number],
): JsonPatchHistory {
  return [...history, entry].sort((a, b) => a.date.valueOf() - b.date.valueOf())
}
