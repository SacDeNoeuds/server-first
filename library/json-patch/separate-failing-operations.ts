import { applyPatch } from "./apply-patch"
import type { JsonPatch } from "./operation"

export function separateFailingOperations<T extends object>(
  value: T,
  patch: JsonPatch,
) {
  const clone = structuredClone(value)
  const acc = { valid: [] as JsonPatch, invalid: [] as JsonPatch }
  patch.forEach((operation) => {
    try {
      applyPatch(clone, [operation])
      acc.valid.push(operation)
    } catch {
      acc.invalid.push(operation)
    }
  })
  return acc
}
