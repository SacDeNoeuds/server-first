import { isObject } from "./object"

export const stringify = (value: unknown, space?: string | number) => {
  return JSON.stringify(value, replacer, space)
}

export const parse = <T = unknown>(value: string) => {
  return JSON.parse(value, reviver) as T
}

// export function toUnRevived<T = unknown, U = unknown>(value: T): U {
//   return JSON.parse(stringify(value))
// }
// export function toRevived<T = unknown, U = unknown>(value: T): U {
//   return parse(JSON.stringify(value))
// }

const replacer = (_: string, value: unknown): any => {
  if (typeof value === "bigint")
    return { _type: "bigint", value: value.toString() }

  if (value instanceof Map)
    return { _type: "map", value: Object.fromEntries(value) }

  if (value instanceof Set)
    return { _type: "set", value: Array.from(value.values()) }

  if (value instanceof RegExp) {
    return { _type: "regexp", pattern: value.source, flags: value.flags }
  }
  return value
}

type ValueToRevive =
  | { _type: "bigint"; value: string }
  | { _type: "map"; value: Record<PropertyKey, unknown> }
  | { _type: "set"; value: unknown[] }
  | { _type: "regexp"; pattern: string; flags: string }

const isValueToRevive = (value: unknown): value is ValueToRevive =>
  isObject(value) && "_type" in value

const dateIsoStringRegex =
  /^[0-9]{1,4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z$/

const reviver = (_: string, value: unknown): any => {
  if (typeof value === "string" && dateIsoStringRegex.test(value))
    return new Date(value)
  if (!isValueToRevive(value)) return value
  switch (value._type) {
    case "bigint":
      return BigInt(value.value)
    case "map":
      return new Map(Object.entries(value.value))
    case "set":
      return new Set(value.value)
    case "regexp":
      return new RegExp(value.pattern, value.flags)
  }
}
