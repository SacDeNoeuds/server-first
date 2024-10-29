export const trim = (value: string) => value.trim()
export const isString = (value: unknown): value is string =>
  typeof value === "string"
