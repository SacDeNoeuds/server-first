export { pipe as flow, pipeWith as pipe } from "pipe-ts"

export function isInstanceOf<T>(constructor: new (...args: any[]) => T) {
  return (value: unknown): value is T => value instanceof constructor
}

export function tryOr<T, Fallback>(fn: () => T, or: () => Fallback) {
  try {
    return fn()
  } catch {
    return or()
  }
}

export const panic = <E>(error: E): never => {
  throw error
}
