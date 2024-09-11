export function tryOr<T, Fallback>(fn: () => T, or: () => Fallback) {
  try {
    return fn()
  } catch {
    return or()
  }
}
