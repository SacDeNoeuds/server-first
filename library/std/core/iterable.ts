import { flow } from "./functions"

const identity = <T>(value: T) => value
const isNotNil = <T>(value: T | undefined | null): value is T =>
  value !== null && value !== undefined
function not<T>(predicate: (value: T) => unknown) {
  return (value: T): boolean => !predicate(value)
}

export function* empty<T>(): Iterable<T> {}

export function* of<T>(value: T): Iterable<T> {
  yield value
}

const fromMaybe = <T>(value: T | undefined) =>
  (value ? of(value) : empty()) as Iterable<T>

export const reduce =
  <Output, T>(initial: Output, reducer: (acc: Output, value: T) => Output) =>
  (iterable: Iterable<T>): Output => {
    let acc = initial
    for (const item of iterable) acc = reducer(acc, item)
    return acc
  }

type Mapper<T, U> = (value: T, index: number) => U
type Predicate<T> = (value: T, index: number) => unknown
type Refine<T, U extends T> = (value: T, index: number) => value is U

export function partition<T, U extends T>(
  refiner: (value: T) => value is U,
): (array: T[]) => { left: Exclude<T, U>[]; right: U[] }
export function partition<T>(
  predicate: (value: T) => unknown,
): (array: T[]) => { left: T[]; right: T[] } {
  return reduce<{ left: T[]; right: T[] }, T>(
    { left: [], right: [] },
    (acc, value) => {
      const key = predicate(value) ? "right" : "left"
      return { ...acc, [key]: [...acc[key], value] }
    },
  )
}

export const flatMap = <T, U>(mapper: Mapper<T, Iterable<U>>) =>
  function* (iterable: Iterable<T>): Iterable<U> {
    let index = 0
    for (const item of iterable) yield* mapper(item, index++)
  }

export const flatten: <T>(iterable: Iterable<Iterable<T>>) => Iterable<T> =
  flatMap(identity)

export const map = <T, U>(mapper: Mapper<T, U>) => flatMap(flow(mapper, of))

export const some = <T>(predicate: Predicate<T>) =>
  flow(findFirst(predicate), isNotNil)

export const every = <T>(predicate: Predicate<T>) =>
  not(some<T>((value, index) => !predicate(value, index)))

export function findFirst<T, U extends T>(
  predicate: (value: T, index: number) => value is U,
): (iterable: Iterable<T>) => U | undefined
export function findFirst<T>(
  predicate: Predicate<T>,
): (iterable: Iterable<T>) => T | undefined
export function findFirst(predicate: (value: any, index: number) => unknown) {
  return (iterable: Iterable<any>) => {
    let index = 0
    for (const item of iterable)
      if (predicate(item, index++)) return item ?? undefined
    return undefined
  }
}

export const findFirstMap = <T, U>(mapper: (value: T) => U | undefined) =>
  function (iterable: Iterable<T>): U | undefined {
    for (const item of iterable) {
      const match = mapper(item)
      if (match) return match
    }
    return undefined
  }

export const filterMap = <T, U>(mapper: (value: T) => U | undefined) =>
  flatMap<T, U>(flow(mapper, fromMaybe))

export function filter<T, U extends T>(
  refine: (value: T) => value is U,
): (value: Iterable<T>) => Iterable<U>
export function filter<T>(
  predicate: (value: T) => unknown,
): (value: Iterable<T>) => Iterable<T>
export function filter(predicate: (value: any) => unknown) {
  return filterMap((value) => (predicate(value) ? value : undefined))
}

export const compact: <T>(iterable: Iterable<T | undefined>) => Iterable<T> =
  filterMap(identity)

export const apply = <T, U>(params: T) =>
  map<(params: T) => U, U>((fn) => fn(params))

export const concat = <T>(a: Iterable<T>) =>
  function* (b: Iterable<T>): Iterable<T> {
    yield* a
    yield* b
  }

export const insertAt =
  (index: number) =>
  <T>(value: T) =>
    function* (iterable: Iterable<T>): Iterable<T> {
      let currentIndex = 0
      for (const item of iterable) {
        if (currentIndex === index) yield value
        yield item
        currentIndex++
      }
    }

export const append = <T>(value: T) => concat([value])
export const prepend = insertAt(0)

export const groupBy =
  <T, U extends PropertyKey>(grouper: (item: T) => U) =>
  (iterable: Iterable<T>): Record<U, T[]> => {
    const result = {} as Record<U, T[]>
    for (const item of iterable) {
      const key = grouper(item)
      if (result[key]) result[key].push(item)
      else result[key] = [item]
    }
    return result
  }
