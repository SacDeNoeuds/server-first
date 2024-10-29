import * as S from "superstruct"
import { TaggedClass } from "../branded-types/tagged"
import { flow, pipe } from "../core/functions"
import { map as mapStruct } from "../core/object"

const instance: unique symbol = Symbol("struct")

export interface DecodeIssue {
  readonly type: string
  readonly path: Array<string | number>
  readonly refinement: string | undefined
  readonly message: string
  readonly value: unknown
}
export class DecodeError extends TaggedClass("DecodeError")<
  DecodeIssue & { readonly issues: DecodeIssue[] }
> {}
function toDecodeIssue(failure: S.Failure): DecodeIssue {
  return {
    message: failure.message,
    path: failure.path,
    type: failure.type,
    refinement: failure.refinement,
    value: failure.value,
  }
}
function toDecodeError(error: S.StructError): DecodeError {
  return new DecodeError({
    ...toDecodeIssue(error),
    get issues() {
      return error.failures().map(toDecodeIssue)
    },
  })
}

export interface Schema<T> {
  [instance]: S.Struct<T, any>
  // is: (value: unknown) => value is T
  decode: (value: unknown) => [DecodeError, undefined] | [undefined, T]
}

export function toSchema<T>(struct: S.Struct<T, any>): Schema<T> {
  return {
    [instance]: struct,
    // is: (value) => struct.is(value),
    decode: (value) => {
      const [err, result] = struct.validate(value, { coerce: true, mask: true })
      return err ? [toDecodeError(err), undefined] : [err, result]
    },
  }
}
export type InferValue<T extends Schema<any>> = S.Infer<T[typeof instance]>
function toStruct<T>(schema: Schema<T>) {
  return schema[instance]
}

// primitives
export const untrimmedString = toSchema(S.string())
export const string = toSchema(S.trimmed(S.string()))
export const unknown = toSchema(S.unknown())
export const literal = flow(S.literal, toSchema) as <T extends number | string>(
  literal: T,
) => Schema<T>
export const boolean = toSchema(S.boolean())
export const number = toSchema(S.number())
export const date = toSchema(S.date())

// modifiers
export const refine =
  <T>(name: string, refiner: (value: T) => boolean) =>
  (schema: Schema<T>): Schema<T> =>
    toSchema(S.refine(schema[instance], name, refiner))

export const optional = flow(toStruct, S.optional, toSchema)
export const pattern =
  (regexp: RegExp) =>
  <T extends string>(schema: Schema<T>) =>
    toSchema(S.pattern(schema[instance], regexp))
export const min =
  <T extends number | Date>(value: T, exclusive?: boolean) =>
  (schema: Schema<T>) =>
    toSchema(S.min(schema[instance], value, { exclusive }))
export const max =
  <T extends number | Date>(value: T, exclusive?: boolean) =>
  (schema: Schema<T>) =>
    toSchema(S.max(schema[instance], value, { exclusive }))
export const sizeBetween =
  (min: number, max: number) =>
  <T extends string | any[] | Map<any, any> | Set<any>>(schema: Schema<T>) =>
    toSchema(S.size(schema[instance], min, max))
export const minSize =
  (min: number) =>
  <T extends string | any[] | Map<any, any> | Set<any>>(schema: Schema<T>) =>
    toSchema(S.size(schema[instance], min))

// composites
type StructProps = Record<string, Schema<any>>
export type StructSchema<Props extends StructProps> = {
  [Key in keyof Props]: InferValue<Props[Key]>
}
export function object<Props extends Record<string, Schema<any>>>(
  props: Props,
) {
  return pipe(
    props,
    mapStruct(toStruct),
    S.object,
    toSchema,
  ) as unknown as Schema<StructSchema<Props>>
}

export const array = flow(toStruct, S.array, toSchema) as <T>(
  item: Schema<T>,
) => Schema<T[]>
export const Map = <Key, Value>(key: Schema<Key>, value: Schema<Value>) =>
  toSchema(S.map(toStruct(key), toStruct(value)))
export const Set = flow(toStruct as any, S.set, toSchema) as <T>(
  item: Schema<T>,
) => Schema<Set<T>>
// export const tuple = S.tuple
// export const union = S.union
// export const unionWith =
//   <B>(b: Schema<B>) =>
//   <A>(a: Schema<A>) =>
//     toSchema(S.union([a[instance], b[instance]])) as Schema<A | B>
// export const intersect =
//   <B>(b: Schema<B>) =>
//   <A>(a: Schema<A>) =>
//     toSchema(S.intersection([a[instance], b[instance]])) as Schema<A & B>

export function map<Input, Output>(
  output: Schema<Output>,
  mapper: (input: Input) => Output,
) {
  return (input: Schema<Input>): Schema<Output> => {
    return toSchema(S.coerce(output[instance], input[instance], mapper))
  }
}

// creators
export const fromPredicate = flow(S.define, toSchema) as <T>(
  name: string,
  predicate: (input: unknown) => input is T,
) => Schema<T>

const dateFromStringSchema = pipe(
  string,
  map(date, (value) => new Date(value)),
  refine("DateFromString", (value) => !Number.isNaN(value.getTime())),
)
export const dateFromString = () => dateFromStringSchema
