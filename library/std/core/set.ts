import { isInstanceOf } from "./functions"

export function fromArray<T>(array: T[]): Set<T> {
  return new Set(array)
}

export const isSet = isInstanceOf(Set)
