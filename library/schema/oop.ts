export interface Issue {
  readonly type: string
  readonly path: PropertyKey[]
  readonly refinement: string | undefined
  readonly value: unknown
}

export type Result<T> =
  | [{ readonly issues: Issue[] }, undefined]
  | [undefined, T]

function failure(
  context: DecodeContext,
  value: unknown,
  type: string,
  refinement?: string,
): Result<never> {
  const issue: Issue = { value, type, path: context.path, refinement }
  // Mutate! because the reference is kept across one context.
  // The context will be created upon the first `decode` function of the chain
  // and the `issues` reference will be kept all along.
  context.issues.push(issue)
  return [{ issues: context.issues }, undefined]
}
function success<T>(context: DecodeContext, value: T): Result<T> {
  return context.issues.length > 0
    ? [{ issues: context.issues }, undefined]
    : [undefined, value]
}

export class Schema<T, Meta = {}> {
  static new = <T, Meta = {}>(
    options: Pick<Schema<T>, "type" | "decode" | "refinements"> & {
      meta?: Meta
    },
  ) => {
    return new Schema(
      options.type,
      options.decode,
      options.refinements,
      options.meta,
    )
  }

  constructor(
    readonly type: string,
    readonly decode: (value: unknown, context?: DecodeContext) => Result<T>,
    readonly refinements: string[] = [],
    readonly meta: Meta = {} as Meta,
  ) {}

  map = <U>(mapper: (value: T) => U) => {
    return Schema.new({
      type: this.type,
      refinements: this.refinements,
      decode: (value, context = createDecodeContext()) => {
        const [err, result] = this.decode(value, context)
        if (err) return [err, undefined]
        return [undefined, mapper(result)]
      },
    })
  }

  refine = (name: string, refine: (value: T) => boolean) => {
    return Schema.new<T>({
      type: this.type,
      refinements: [...this.refinements, name],
      decode: (value, context = createDecodeContext()) => {
        const [err, result] = this.decode(value, context)
        if (err) return [err, undefined]
        return refine(result)
          ? success(context, result)
          : failure(context, result, this.type, name)
      },
    })
  }
}

export function unsafeDecode<T>(value: unknown, schema: Schema<T>): T {
  const [err, result] = schema.decode(value)
  if (err) throw new Error("decode failure", { cause: err.issues })
  return result
}

export type InferValue<T> = T extends Schema<infer S> ? S : never
interface DecodeContext {
  readonly path: PropertyKey[]
  readonly parent: unknown
  readonly issues: Issue[]
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
  return Schema.new({
    type: name,
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      return predicate(input)
        ? success(context, input)
        : failure(context, input, "string")
    },
  })
}

// export const refineTo = refine as <T, U extends T>(
//   name: string,
//   predicate: (value: T) => value is U,
// ) => (schema: Schema<T>) => Schema<U>

export function cast<T>(name: string): Schema<T> {
  return Schema.new<T>({
    type: name,
    refinements: [],
    decode: (value) => [undefined, value as T],
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
  return <Input>(schema: Schema<Input>) =>
    Schema.new<Output>({
      type: `${schema.type} |> ${target.type}`,
      refinements: [...schema.refinements, ...target.refinements],
      decode: (input, context = createDecodeContext()) => {
        const [err, value] = schema.decode(input, context)
        return err ? [err, undefined] : target.decode(value, context)
      },
    })
}

// export function lazy<T>(lazy: () => Schema<T>): Schema<T> {
//   return {
//     get type() {
//       return lazy().type
//     },
//     get refinements() {
//       return lazy().refinements
//     },
//     decode: (input, context) => lazy().decode(input, context),
//   }
// }

export const untrimmedString = fromPredicate(
  "string",
  (value: unknown) => typeof value === "string",
)
export const string = untrimmedString.map((s) => s.trim())
const numberOrNaN = fromPredicate(
  "number",
  (value: unknown) => typeof value === "number",
)
const isNotNaN = (value: number) => !Number.isNaN(value)
export const number = numberOrNaN.refine("NaN guard", isNotNaN)
export const boolean = fromPredicate(
  "boolean",
  (value: unknown) => typeof value === "boolean",
)

export const numberFromString = string.map(Number).refine("NaN guard", isNotNaN)

type Literal = string | number | boolean | null | undefined
const isLiteral =
  <L extends [Literal, ...Literal[]]>(...literals: L) =>
  (value: unknown): value is L[number] =>
    literals.some((literal) => value === literal)

export function literal<L extends [Literal, ...Literal[]]>(...literals: L) {
  return fromPredicate("literal", isLiteral(...literals))
}

function isInstanceOf<T>(constructor: new (...args: any[]) => T) {
  return (value: unknown): value is T => value instanceof constructor
}

export function instanceOf<T>(constructor: new () => T) {
  return fromPredicate(constructor.name, isInstanceOf(constructor))
}

export type UnionSchema<T> = Schema<T, { readonly schemas: Schema<unknown>[] }>
export function union<T extends [Schema<any>, ...Schema<any>[]]>(
  ...schemas: T
): UnionSchema<InferValue<T[number]>> {
  const name = schemas.map((schema) => schema.type).join(" | ")
  return Schema.new<
    InferValue<T[number]>,
    { readonly schemas: Schema<unknown>[] }
  >({
    type: name,
    meta: { schemas },
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      // remove reference in case a schema matches.
      const nestedIssues: Issue[][] = []
      for (const schema of schemas) {
        const issues = [...context.issues]
        nestedIssues.push(issues)
        const [err, result] = schema.decode(input, { ...context, issues })
        if (!err) return success(context, result)
      }
      return failure({ ...context, issues: nestedIssues.flat(1) }, input, name)
    },
  })
}

export const date = union(instanceOf(Date), string, number)
  .map((input) => new Date(input))
  .refine("Date", (date) => !Number.isNaN(date.valueOf()))

export function or<B>(b: Schema<B>) {
  return <A>(a: Schema<A>) => union(a, b)
}

export const optional = or(literal(undefined))
export const nil = or(literal(undefined, null))

type ArraySchema<T> = Schema<T[], { readonly item: Schema<T> }>
export function array<T>(item: Schema<T>): ArraySchema<T> {
  return Schema.new({
    type: `${item.type}[]`,
    refinements: [],
    meta: { item },
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
  })
}

type SetSchema<T> = Schema<Set<T>, { readonly item: Schema<T> }>

export { Set_ as Set }
const isSet = isInstanceOf(Set)
function Set_<T>(item: Schema<T>): SetSchema<T> {
  return Schema.new({
    type: `Set<${item.type}>`,
    refinements: [],
    meta: { item },
    decode: (input, context = createDecodeContext()) => {
      if (!isSet(input)) return failure(context, input, "array")
      const array = Array.from(input).map((value, index) => {
        const ctx = addContextPathSegment(context, index)
        const [_, result] = item.decode(value, ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        return result
      })
      return success(context, new Set(array.filter(Boolean)) as Set<T>)
    },
  })
}

export type PropsOf<Value> = {
  [Key in keyof Value]: Schema<Value[Key]>
}

export type ObjectSchema<Value> = Schema<
  Value,
  { readonly props: PropsOf<Value> }
>

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && value.constructor === Object
}
export function object<Value>(props: PropsOf<Value>): ObjectSchema<Value> {
  return Schema.new({
    type: "object",
    meta: { props },
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      if (!isObject(input)) return failure(context, input, "object")
      const acc = {} as Value
      for (const key of Object.keys(props)) {
        const ctx = addContextPathSegment(context, key)
        const [err, result] = props[key as keyof Value].decode(input[key], ctx)
        // if undefined, an issue will be added to the context
        // and the error will be taken from context at `success()` step.
        if (!err) acc[key as keyof Value] = result
      }
      return success(context, acc)
    },
  })
}

object.pick = function pick<T, K extends keyof T>(...keys: K[]) {
  return (schema: ObjectSchema<T>) => {
    const props = {} as PropsOf<Pick<T, K>>
    for (const key of keys)
      props[key as keyof typeof props] = schema.meta.props[key]

    return object(props)
  }
}

object.concat = function concat<Value extends Record<PropertyKey, any>>(
  props: PropsOf<Value>,
) {
  return <T>(schema: ObjectSchema<T>) =>
    object({ ...schema.meta.props, ...props })
}

object.omit = function omit<T, K extends keyof T>(...keys: K[]) {
  return (schema: ObjectSchema<T>) => {
    const props = {} as PropsOf<Omit<T, K>>
    for (const [key, value] of Object.entries(schema.meta.props)) {
      if (keys.includes(key as K)) continue
      props[key as keyof typeof props] = value as any
    }

    return object(props)
  }
}

export type MapSchema<T extends Map<any, any>> = Schema<
  T,
  {
    readonly key: Schema<MapKey<T>>
    readonly value: Schema<MapValue<T>>
  }
>
export { Map_ as Map }
type MapKey<T> = T extends Map<infer K, any> ? K : never
type MapValue<T> = T extends Map<any, infer V> ? V : never

const isMap = isInstanceOf(Map)
function Map_<T extends Map<PropertyKey, any>>(
  key: Schema<MapKey<T>>,
  value: Schema<MapValue<T>>,
): MapSchema<T> {
  const name = `Map<${key.type}, ${value.type}>`
  return Schema.new({
    type: name,
    meta: { key, value },
    refinements: [],
    decode: (input, context = createDecodeContext()) => {
      if (!isMap(input)) return failure(context, input, name)

      const acc = new Map() as T
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
  })
}

// export function greaterThan<T extends { valueOf(): number }>(
//   min: T,
//   reason: string,
// ) {
//   return refine<T>(reason, (value) => value.valueOf() > min.valueOf())
// }
// export function lowerThan<T extends { valueOf(): number }>(
//   max: T,
//   reason: string,
// ) {
//   return refine<T>(reason, (value) => value.valueOf() < max.valueOf())
// }
// export function between<T extends { valueOf(): number }>(
//   min: T,
//   max: T,
//   reason: string,
// ) {
//   return refine<T>(reason, (value) => {
//     return value.valueOf() > min.valueOf() && value.valueOf() < max.valueOf()
//   })
// }

// export function nonEmpty<T extends { length: number } | { size: number }>(
//   reason = "NonEmpty",
// ) {
//   return size<T>({ min: 1, reason })
// }

// export function size<T extends { size: number } | { length: number }>(options: {
//   min?: number
//   max?: number
//   reason: string
// }) {
//   return refine<T>(options.reason, (value) => {
//     const size: number = (value as any)?.length ?? (value as any)?.size
//     const min = options.min ?? -Infinity
//     const max = options.max ?? Infinity
//     return size >= min && size < max
//   })
// }
