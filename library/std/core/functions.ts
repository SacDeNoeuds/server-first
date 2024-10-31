export { pipe as flow, pipeWith as pipe } from "pipe-ts"
export { length as lengthOfStringId }

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

const length = 16

export function StringId(): string {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length)
}
