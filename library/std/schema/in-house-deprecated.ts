import { TaggedClass } from "../branded-types"
import * as core from "../core"

export interface DecodeIssue {
  readonly type: string
  readonly path: PropertyKey[]
  readonly refinement: string | undefined
  readonly value: unknown
}

export class DecodeError extends TaggedClass("DecodeError")<{
  readonly issues: DecodeIssue[]
}> {}

export type DecodeResult<T> = [DecodeError, undefined] | [undefined, T]

function failure(
  context: DecodeContext,
  value: unknown,
  type: string,
  refinement?: string,
): DecodeResult<never> {
  const issue: DecodeIssue = { value, type, path: context.path, refinement }
  // Mutate! because the reference is kept across one context.
  // The context will be created upon the first `decode` function of the chain
  // and the `issues` reference will be kept all along.
  context.issues.push(issue)
  return [new DecodeError({ issues: context.issues }), undefined]
}
function success<T>(context: DecodeContext, value: T): DecodeResult<T> {
  return context.issues.length > 0
    ? [new DecodeError({ issues: context.issues }), undefined]
    : [undefined, value]
}

export interface Schema<T> {
  type: string
  refinements: string[]
  // is: (value: unknown) => value is T
  decode: (value: unknown, context?: DecodeContext) => DecodeResult<T>
}

export type InferValue<T> = T extends Schema<infer S> ? S : never
interface DecodeContext {
  readonly path: PropertyKey[]
  readonly parent: unknown
  readonly issues: DecodeIssue[]
}
function createDecodeContext(): DecodeContext {
  return {
    issues: [],
    path: [],
    parent: undefined,
  }
}
function addContextPathSegment(
  context: DecodeContext,
  segment: PropertyKey,
): DecodeContext {
  return { ...context, path: [...context.path, segment] }
}

export function fromPredicate<Value>(
  name: string,
  predicate: (value: unknown) => value is Value,
): Schema<Value> {
  return {
    type: name,
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      return predicate(input)
        ? success(context, input)
        : failure(context, input, "string")
    },
  }
}

export function refine<Value>(name: string, refine: (value: Value) => boolean) {
  return (schema: Schema<Value>): Schema<Value> => ({
    type: schema.type,
    refinements: [...schema.refinements, name],
    decode: (value, context = createDecodeContext()) => {
      const [err, result] = schema.decode(value, context)
      if (err) return [err, undefined]

      return refine(result)
        ? success(context, result)
        : failure(context, value, schema.type, name)
    },
  })
}
export const refineTo = refine as <T, U extends T>(
  name: string,
  predicate: (value: T) => value is U,
) => (schema: Schema<T>) => Schema<U>

export function map<Input, Output>(mapper: (input: Input) => Output) {
  return (schema: Schema<Input>): Schema<Output> => ({
    type: schema.type,
    refinements: schema.refinements,
    decode: (value, context = createDecodeContext()) => {
      const [err, result] = schema.decode(value, context)
      return err ? [err, undefined] : [err, mapper(result)]
    },
  })
}

// export function flatMap<T, U>(name: string, mapper: (value: T) => Schema<U>) {
//   const nested = mapper(undefined).name
//   return (schema: Schema<T>): Schema<U> => ({
//     name: mapper(undefined).name,
//     refinements: schema.refinements,
//     decode: (value, context = createDecodeContext()) => {
//       const [err, result] = schema.decode(value, context)
//       if (err) return [err, undefined]
//       return mapper(result).decode(value, context)
//     }
//   })
// }

export function compose<Output>(target: Schema<Output>) {
  return <Input>(schema: Schema<Input>): Schema<Output> => ({
    type: `${schema.type} |> ${target.type}`,
    refinements: [...schema.refinements, ...target.refinements],
    decode: (input, context = createDecodeContext()) => {
      const [err1, value1] = schema.decode(input, context)
      if (err1) return [err1, undefined]
      return target.decode(value1, context)
    },
  })
}

export const untrimmedString = fromPredicate("string", core.string.isString)
export const string = core.pipe(untrimmedString, map(core.string.trim))
const numberOrNaN = fromPredicate("number", core.number.isNumber)
export const number = core.pipe(
  numberOrNaN,
  refine("NaN guard", core.number.isNotNaN),
)
export const boolean = fromPredicate("boolean", core.boolean.isBoolean)

export const numberFromString = core.pipe(
  string,
  map(Number),
  refine("NaN guard", core.number.isNotNaN),
)

type Literal = string | number | boolean | null | undefined
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal)

export function literal<L extends [Literal, ...Literal[]]>(...literals: L) {
  return fromPredicate("literal", isLiteral(...literals))
}

export function instanceOf<T>(constructor: new () => T) {
  return fromPredicate("instance of", core.isInstanceOf(constructor))
}

export const date = core.pipe(
  union(instanceOf(Date), string, number),
  map(core.date.from),
  refine("Date", core.date.isValid),
)

export interface UnionSchema<T> extends Schema<T> {
  readonly schemas: Schema<unknown>[]
}
export function union<T extends [Schema<any>, ...Schema<any>[]]>(
  ...schemas: T
): UnionSchema<InferValue<T[number]>> {
  const name = schemas.map((schema) => schema.type).join(" | ")
  return {
    type: name,
    schemas,
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      // remove reference in case a schema matches.
      const nestedIssues: DecodeIssue[][] = []
      for (const schema of schemas) {
        const issues = [...context.issues]
        nestedIssues.push(issues)
        const [err, result] = schema.decode(input, { ...context, issues })
        if (!err) return [undefined, result]
      }
      return failure({ ...context, issues: nestedIssues.flat(1) }, input, name)
    },
  }
}
export function or<B>(b: Schema<B>) {
  return <A>(a: Schema<A>) => union(a, b)
}

export const optional = or(literal(undefined))
export const nil = or(literal(undefined, null))

interface ArraySchema<T> extends Schema<T[]> {
  readonly item: Schema<T>
}
export function array<T>(item: Schema<T>): ArraySchema<T> {
  return {
    type: `${item.type}[]`,
    refinements: [],
    item,
    decode: (input, context = createDecodeContext()) => {
      if (!Array.isArray(input)) return failure(context, input, "array")
      const array = input.map((value, index) => {
        const ctx = addContextPathSegment(context, index)
        const [_, result] = item.decode(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result
      })
      return success(context, array.filter(Boolean) as T[])
    },
  }
}

interface SetSchema<T> extends Schema<Set<T>> {
  readonly item: Schema<T>
}

export { Set_ as Set }
function Set_<T>(item: Schema<T>): SetSchema<T> {
  return {
    type: `Set<${item.type}>`,
    refinements: [],
    item,
    decode: (input, context = createDecodeContext()) => {
      if (!core.set.isSet(input)) return failure(context, input, "array")
      const array = Array.from(input).map((value, index) => {
        const ctx = addContextPathSegment(context, index)
        const [_, result] = item.decode(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result
      })
      return success(context, new Set(array.filter(Boolean)) as Set<T>)
    },
  }
}

export type PropsOf<Value> = {
  [Key in keyof Value]: Schema<Value[Key]>
}

export interface ObjectSchema<Value> extends Schema<Value> {
  readonly props: PropsOf<Value>
}

export function object<Value>(props: PropsOf<Value>): ObjectSchema<Value> {
  return {
    type: "object",
    props,
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      if (!core.object.isObject(input)) return failure(context, input, "object")
      const acc = {} as Value
      for (const key of core.object.keys(props)) {
        const ctx = addContextPathSegment(context, key)
        const [err, result] = props[key].decode(input[key], ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (!err) acc[key] = result
      }
      return success(context, acc)
    },
  }
}

object.pick = function pick<T, K extends keyof T>(...keys: K[]) {
  return (schema: ObjectSchema<T>) =>
    core.pipe(schema.props, core.object.pick(...keys), object<Pick<T, K>>)
}

object.concat = function concat<Value extends Record<PropertyKey, any>>(
  props: PropsOf<Value>,
) {
  return <T>(schema: ObjectSchema<T>) =>
    core.pipe(schema.props, core.object.concat(props), object<T & Value>)
}

object.omit = function omit<T, K extends keyof T>(...keys: K[]) {
  return (schema: ObjectSchema<T>) =>
    core.pipe(
      schema.props as any,
      core.object.omit(...keys),
      object<Omit<T, K>>,
    )
}

export interface MapSchema<Key, Value> extends Schema<Map<Key, Value>> {
  readonly key: Schema<Key>
  readonly value: Schema<Value>
}
export { Map_ as Map }
function Map_<Key extends PropertyKey, Value>(
  key: Schema<Key>,
  value: Schema<Value>,
): MapSchema<Key, Value> {
  const name = `Map<${key.type}, ${value.type}>`
  return {
    type: name,
    key,
    value,
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      if (!core.map.isMap(input)) return failure(context, input, name)

      const acc = new Map<Key, Value>()
      input.forEach((v, k) => {
        const ctx = addContextPathSegment(context, k as PropertyKey)
        const [keyErr, keyResult] = key.decode(k, ctx)
        const [itemErr, itemResult] = value.decode(v, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (!keyErr && !itemErr) acc.set(keyResult, itemResult)
      })
      return success(context, acc)
    },
  }
}

export function min<T extends { valueOf(): number }>(min: T, reason: string) {
  return refine<T>(reason, (value) => value.valueOf() > min.valueOf())
}
export function max<T extends { valueOf(): number }>(max: T, reason: string) {
  return refine<T>(reason, (value) => value.valueOf() < max.valueOf())
}
export function between<T extends { valueOf(): number }>(
  min: T,
  max: T,
  reason: string,
) {
  return refine<T>(reason, (value) => {
    return value.valueOf() > min.valueOf() && value.valueOf() < max.valueOf()
  })
}

export function nonEmpty<T extends { length: number } | { size: number }>(
  reason = "NonEmpty",
) {
  return size<T>({ min: 1, reason })
}

export function size<T extends { size: number } | { length: number }>(options: {
  min?: number
  max?: number
  reason: string
}) {
  return refine<T>(options.reason, (value) => {
    const size: number = (value as any)?.length ?? (value as any)?.size
    const min = options.min ?? -Infinity
    const max = options.max ?? Infinity
    return size >= min && size < max
  })
}
