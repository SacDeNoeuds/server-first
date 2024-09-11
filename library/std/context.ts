const none = Symbol("none")
export function Context<T>(name: string) {
  let value: T | typeof none

  return [provideContext, getContext] as const

  function getContext() {
    if (value === none) throw new Error(`context "${name}" not provided`)
    return value as T
  }
  function provideContext(data: T) {
    value = data
  }
}
