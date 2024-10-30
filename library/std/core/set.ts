import { isInstanceOf } from "./functions"

export function fromIterable<T>(iterable: Iterable<T>): Set<T> {
  return new Set(iterable)
}

export const isSet = isInstanceOf(Set)

// export function concat<T>(b: Set<T>) {
//   return (a: Set<T>) => new Set<T>([...a, ...b])
// }
// export function merge<T>(into: Set<T>, newSet: Set<T>) {
//   newSet.forEach((value) => into.add(value))
// }
