// import {
//   z,
//   ZodArray,
//   ZodDate,
//   ZodError,
//   ZodMap,
//   ZodNumber,
//   ZodSet,
//   ZodString,
//   ZodType,
//   type ZodIssue,
// } from "zod"
// import { TaggedClass } from "../branded-types/tagged"
// import { map as mapStruct } from "../object"
// import { flow, pipe } from "../pipe"

// const instance: unique symbol = Symbol("zod")

// export interface DecodeIssue {
//   readonly type: string
//   readonly path: Array<string | number>
//   // readonly refinement: string | undefined
//   readonly message: string
//   // readonly value: unknown
// }
// export class DecodeError extends TaggedClass("DecodeError")<{
//   readonly message: string
//   readonly issues: DecodeIssue[]
// }> {}
// function toDecodeIssue(issue: ZodIssue): DecodeIssue {
//   return {
//     message: issue.message,
//     path: issue.path,
//     type: issue.code,
//   }
// }
// function toDecodeError(error: ZodError): DecodeError {
//   return new DecodeError({
//     message: error.message,
//     get issues() {
//       return error.issues.map(toDecodeIssue)
//     },
//   })
// }

// export interface Schema<T> {
//   [instance]: ZodType<T, any, any>
//   // is: (value: unknown) => value is T
//   decode: (value: unknown) => [DecodeError, undefined] | [undefined, T]
// }

// export function toSchema<T>(zod: ZodType<T, any, any>): Schema<T> {
//   return {
//     [instance]: zod,
//     // is: (value) => struct.is(value),
//     decode: (value) => {
//       const result = zod.safeParse(value)
//       return result.success
//         ? [undefined, result.data]
//         : [toDecodeError(result.error), undefined]
//     },
//   }
// }
// export type InferValue<T extends Schema<any>> = z.infer<T[typeof instance]>
// function toStruct<T>(schema: Schema<T>) {
//   return schema[instance]
// }

// // primitives
// export const untrimmedString = toSchema(z.string())
// export const string = toSchema(z.string().trim())
// export const unknown = toSchema(z.unknown())
// export const literal = flow(z.literal, toSchema) as <T extends number | string>(
//   literal: T,
// ) => Schema<T>
// export const boolean = toSchema(z.boolean())
// export const number = toSchema(z.number())
// export const date = toSchema(z.date())

// // modifiers
// export const refine =
//   <T>(name: string, refiner: (value: T) => boolean) =>
//   (schema: Schema<T>): Schema<T> =>
//     toSchema(schema[instance].refine(refiner, name))

// export const optional = <T>(schema: Schema<T>) => schema[instance].optional()
// export const pattern =
//   (name: string, regexp: RegExp) =>
//   <T extends string>(schema: Schema<T>) =>
//     toSchema(schema[instance].refine((value) => regexp.test(value), name))
// export const min =
//   <T extends number | Date>(value: T, exclusive?: boolean) =>
//   (schema: Schema<T>): Schema<T> => {
//     let zod: ZodType<any, any>
//     if (typeof value === "number")
//       zod = (schema[instance] as unknown as ZodNumber)[
//         exclusive ? "gt" : "gte"
//       ](value)
//     else zod = (schema[instance] as unknown as ZodDate).min(value)

//     return toSchema(zod)
//   }
// export const max =
//   <T extends number | Date>(value: T, exclusive?: boolean) =>
//   (schema: Schema<T>) => {
//     let zod: ZodType<any, any>
//     if (typeof value === "number")
//       zod = (schema[instance] as unknown as ZodNumber)[
//         exclusive ? "lt" : "lte"
//       ](value)
//     else zod = (schema[instance] as unknown as ZodDate).max(value)

//     return toSchema(zod)
//   }
// export const sizeBetween =
//   (min: number, max: number) =>
//   <T extends string | any[] | Map<any, any> | Set<any>>(
//     schema: Schema<T>,
//   ): Schema<T> => {
//     let zod: ZodType<any, any, any>
//     if (
//       schema[instance] instanceof ZodString ||
//       schema[instance] instanceof ZodArray
//     )
//       zod = schema[instance].min(min).max(max)
//     else if (schema[instance] instanceof ZodMap)
//       zod = schema[instance].refine(
//         (value) => value.size >= min && value.size <= max,
//       )
//     else if (schema[instance] instanceof ZodSet)
//       zod = schema[instance].refine(
//         (value) => value.size >= min && value.size <= max,
//       )
//     else
//       throw new Error(
//         "Unknown schema type:" + schema[instance].constructor.name,
//       )
//     return toSchema(zod)
//   }

// export const minSize =
//   (min: number) =>
//   <T extends string | any[] | Map<any, any> | Set<any>>(schema: Schema<T>) =>
//     toSchema(S.size(schema[instance], min))

// // composites
// type StructProps = Record<string, Schema<any>>
// export type StructSchema<Props extends StructProps> = {
//   [Key in keyof Props]: InferValue<Props[Key]>
// }
// export function object<Props extends Record<string, Schema<any>>>(
//   props: Props,
// ) {
//   return pipe(
//     props,
//     mapStruct(toStruct),
//     S.object,
//     toSchema,
//   ) as unknown as Schema<StructSchema<Props>>
// }

// export const array = flow(toStruct, S.array, toSchema) as <T>(
//   item: Schema<T>,
// ) => Schema<T[]>
// export const Map = <Key, Value>(key: Schema<Key>, value: Schema<Value>) =>
//   toSchema(S.map(toStruct(key), toStruct(value)))
// export const Set = flow(toStruct as any, S.set, toSchema) as <T>(
//   item: Schema<T>,
// ) => Schema<Set<T>>
// // export const tuple = S.tuple
// // export const union = S.union
// // export const unionWith =
// //   <B>(b: Schema<B>) =>
// //   <A>(a: Schema<A>) =>
// //     toSchema(S.union([a[instance], b[instance]])) as Schema<A | B>
// // export const intersect =
// //   <B>(b: Schema<B>) =>
// //   <A>(a: Schema<A>) =>
// //     toSchema(S.intersection([a[instance], b[instance]])) as Schema<A & B>

// export function map<Input, Output>(
//   output: Schema<Output>,
//   mapper: (input: Input) => Output,
// ) {
//   return (input: Schema<Input>): Schema<Output> => {
//     return toSchema(S.coerce(output[instance], input[instance], mapper))
//   }
// }

// // creators
// export const fromPredicate = flow(S.define, toSchema) as <T>(
//   name: string,
//   predicate: (input: unknown) => input is T,
// ) => Schema<T>

// const dateFromStringSchema = pipe(
//   string,
//   map(date, (value) => new Date(value)),
//   refine("DateFromString", (value) => !Number.isNaN(value.getTime())),
// )
// export const dateFromString = () => dateFromStringSchema
