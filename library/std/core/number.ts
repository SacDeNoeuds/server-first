export const isNumber = (value: unknown): value is number =>
  typeof value === "number"

export const isNotNaN = (n: number) => !Number.isNaN(n)
