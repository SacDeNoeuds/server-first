import type { Simplify, ToNumber, UnionToIntersection } from "../types"
import { flow, pipe } from "./functions"
import * as I from "./iterable"

export function isObject(
  value: unknown,
): value is Record<PropertyKey, unknown> {
  return (
    value !== null && typeof value === "object" && value.constructor === Object
  )
}

type AnyObject = Record<string, any>

export const values: <O extends AnyObject>(struct: O) => O[keyof O] =
  Object.values

export const entries: <O extends AnyObject>(
  struct: O,
) => [keyof O, O[keyof O]][] = Object.entries

export const fromEntries: <O extends AnyObject>(
  entries: Iterable<[keyof O, O[keyof O]]>,
) => O = Object.fromEntries

export const keys: <O extends AnyObject>(struct: O) => Array<keyof O> =
  Object.getOwnPropertyNames as any

export const has =
  <P extends string>(property: P) =>
  <O extends AnyObject>(struct: O): struct is O & { [Key in P]: unknown } =>
    Object.hasOwn(struct, property)

export const rename =
  <O extends AnyObject, Prev extends keyof O, Next extends string>(
    prev: Prev,
    next: Next,
  ) =>
  (struct: O) =>
    pipe(struct, omit(prev), concat({ [next]: struct[prev] })) as Omit<
      O,
      Prev
    > & { [Key in Next]: O[Prev] }

type Mapper<Struct extends AnyObject, Output> = <K extends keyof Struct>(
  value: Struct[K],
  key: K,
) => Output
type Predicate<Struct extends AnyObject> = Mapper<Struct, unknown>
const toEntryPredicate =
  <S extends AnyObject>(predicate: Predicate<S>) =>
  (entry: [key: string, value: unknown]) =>
    predicate(entry[1] as any, entry[0])

export const concat =
  <S2 extends AnyObject>(s2: S2) =>
  <S1 extends AnyObject>(s1: S1): S1 & S2 => ({ ...s1, ...s2 })

// export const assign =
//   <T extends Record<PropertyKey, any>>(value: T) =>
//   <U extends object>(target: U): U & T =>
//     Object.assign(target, value)

export const assignTo =
  <Key extends string, Value>(key: Key) =>
  (value: Value) =>
    ({ [key]: value } as { [K in Key]: Value })

export const some = <O extends AnyObject>(predicate: Predicate<O>) =>
  flow(entries, I.some(toEntryPredicate(predicate)))

export const every = <O extends AnyObject>(predicate: Predicate<O>) =>
  flow(entries, I.every(toEntryPredicate(predicate)))

export const reduce = <O extends AnyObject, Output>(
  initial: Output,
  reducer: <K extends keyof O>(acc: Output, value: O[K], key: K) => Output,
) =>
  flow(
    entries<O>,
    I.reduce(initial, (acc, [key, value]: any) => reducer(acc, value, key)),
  )

export const map = <O extends AnyObject, Output>(mapper: Mapper<O, Output>) =>
  reduce<O, Record<keyof O, Output>>({} as any, (acc, value, key) =>
    Object.assign(acc, { [key]: mapper(value, key) }),
  )

export const filter = <O extends AnyObject>(predicate: Predicate<O>) =>
  flow(entries, I.filter(toEntryPredicate(predicate)) as any, fromEntries<O>)

export const omit = <O extends AnyObject, Key extends keyof O>(
  ...keys: Key[]
) =>
  filter<O>((_, key) => !keys.includes(key as any)) as (
    struct: O,
  ) => Omit<O, Key>

export const pick = <O extends AnyObject, Key extends keyof O>(
  ...keys: Key[]
) =>
  filter<O>((_, key) => keys.includes(key as any)) as (
    struct: O,
  ) => Pick<O, Key>

export const get =
  <O extends AnyObject, K extends keyof O>(key: K) =>
  (struct: O): O[K] =>
    struct[key]

export const findFirstMap: <O extends AnyObject, Output>(
  mapper: Mapper<O, Output | undefined>,
) => (struct: O) => Output | undefined = (mapper: any) =>
  flow(
    entries,
    I.findFirstMap(([key, value]) => mapper(value as any, key as any)),
  )

export type TupleKey<T extends any[]> = ToNumber<Exclude<keyof T, keyof any[]>>

export type StructFromTuple<
  Names extends string[],
  Tuple extends { [Key in TupleKey<Names>]: any },
> = Simplify<
  UnionToIntersection<
    {
      [Name in TupleKey<Names>]: { [Key in Names[Name]]: Tuple[Name] }
    }[TupleKey<Names>]
  >
>

export const fromTuple =
  <Names extends [string, ...string[]]>(...names: Names) =>
  <Tuple extends { [Key in TupleKey<Names>]: any }>(
    tuple: Tuple,
  ): StructFromTuple<Names, Tuple> => {
    return Object.assign(
      {},
      ...names.map((name, index) => ({ [name]: tuple[index as keyof Tuple] })),
    )
  }
