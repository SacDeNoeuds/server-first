import { isInstanceOf } from "./functions"

export function fromEntries<Key, Value>(
  entries: [Key, Value][],
): Map<Key, Value> {
  return new Map(entries)
}

export function fromObject<Key extends PropertyKey, Value>(
  record: Record<Key, Value>,
) {
  return fromEntries<Key, Value>(Object.entries(record) as any)
}

export const isMap = isInstanceOf(Map)
