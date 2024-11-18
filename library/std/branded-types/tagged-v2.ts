import { object } from "../core"

export type Shape = { readonly _tag: string }
type As<Tag extends string = string> = { readonly _tag: Tag }
export type Object<Value extends As> = Readonly<Value>
export type Value<Tag extends string, T> = Object<{ _tag: Tag; value: T }>

export type ValueOf<T extends Shape> = { _tag: any; value: any } extends T
  ? Extract<T, { value: any }>["value"]
  : Omit<T, "_tag">

type IsTaggedAs<Target extends As> = <Input extends As>(
  input: Input | Target,
) => input is Target

export function isTaggedAs<Target extends As>(
  tag: Target["_tag"],
): IsTaggedAs<Target> {
  return <Input extends As>(input: Input | Target): input is Target => {
    return input._tag === tag
  }
}

// export function mapOnly<T extends As>(tag: T["_tag"]) {
//   const isT = isTaggedAs(tag)
//   return <Output>(mapper: (input: T) => Output) => {
//     return <Input extends As>(input: Input | T) => {
//       return isT(input) ? mapper(input) : input
//     }
//   }
// }
// export const flatMapOnly = mapOnly as <T extends As>(
//   tag: T["_tag"],
// ) => <Output extends As>(
//   mapper: (input: T) => Output,
// ) => <Input extends As>(input: Input | T) => Input | Output

// export function mapNot<T extends As>(tag: T["_tag"]) {
//   const isT = isTaggedAs(tag)
//   return <Input extends As, Output>(mapper: (input: Input) => Output) => {
//     return (input: Input | T) => {
//       return isT(input) ? input : mapper(input)
//     }
//   }
// }
// export const flatMapNot = mapNot as <T extends As>(
//   tag: T["_tag"],
// ) => <Input extends As, Output extends As>(
//   mapper: (input: Input) => Output,
// ) => (input: Input | T) => T | Output

/**
 * @example
 * import { tagged } from '@/std'
 *
 * class PersonNotFound extends tagged.Class("PersonNotFound")<{
 *   name: PersonName
 * }> {}
 * const error = new PersonNotFound({ name: PersonName("Jack") })
 *
 * class Person extends tagged.Class("Person")<{
 *   name: PersonName
 *   birthDate: BirthDate
 *   age: PersonAge
 * }> {}
 *
 * const Jack = new Person({
 *   name: PersonName("Jack"),
 *   birthDate: BirthDate(new Date()),
 *   age: PersonAge(42),
 * })
 */
export function Class<Tag extends string>(
  tag: Tag,
): {
  new <Value extends Record<string, any>>(
    ...args: {} extends Value ? [Value?] : [Value]
  ): Object<{ _tag: Tag } & Value>
  _tag: Tag
} {
  return class {
    static _tag = tag
    readonly _tag = tag
    constructor(value?: Record<string, any>) {
      Object.assign(this, value)
    }
  } as any
}

/**
 * @example
 * import { tagged } from '@/std'
 *
 * type Person = tagged.Object<{
 *   _tag: "Person"
 *   name: PersonName
 *   birthDate: BirthDate
 * }>
 * const Person = fromTag<Person>("Person")
 * const Jack = Person({
 *   name: "jack" as PersonName,
 *   birthDate: new Date(),
 *   age: 12,
 *})
 */
export function fromObject<T extends Shape>(_tag: T["_tag"]) {
  return object.concat({ _tag }) as (value: Omit<T, keyof Shape>) => T
}

/**
 * @example
 * import { tagged } from '@/std'
 *
 * type Success<T> = tagged.Value<'Success', T>
 * const Success = fromObject("Success") as <T>(value: T) => Success<T>
 * const result = Success('hello')
 * // Success<string>
 */
export function fromValue<T extends Value<any, any>>(_tag: T["_tag"]) {
  return (value: T["value"]) => ({ _tag, value } as T)
}

type InputToMatchParameter<T> = { _tag: any; value: any } extends T
  ? T extends { value: infer Value }
    ? Value
    : never
  : T

type InputCases<Input extends As, OutputShape = any> = {
  [Case in Input["_tag"]]: (
    value: InputToMatchParameter<Extract<Input, { readonly _tag: Case }>>,
  ) => OutputShape
}

type ReturnTypeOr<T, Fallback> = [T] extends [never]
  ? Fallback
  : T extends (...args: any[]) => infer R
  ? R
  : Fallback
type CaseReturnTypes<Input extends As, Cases extends {}> = {
  [Tag in Input["_tag"]]: ReturnTypeOr<
    Cases[Extract<Tag, keyof Cases>],
    Extract<Input, { readonly _tag: Tag }>
  >
}

/**
 * @example
 * declare const input: Person | PersonNotFound
 * const result = tagged.match(value, {
 *   PersonNotFound: (error) => error.personId,
 * })
 * // Person | PersonId
 */
export function match<
  Input extends As<any>,
  Cases extends Partial<InputCases<Input>>,
>(input: Input, cases: Cases): CaseReturnTypes<Input, Cases>[Input["_tag"]] {
  const mapper = (cases as any)[input._tag]
  const caseInput =
    "value" in input && Object.keys(input).length === 2 ? input.value : input
  return mapper ? mapper(caseInput) : caseInput
}

/**
 * @example
 * declare const input: Person | PersonNotFound
 * const result = tagged.matchAll(value, {
 *    Person: (person) => person.name.length,
 *    PersonNotFound: (err) => err.name,
 *  })
 * // number | PersonName
 */
export function matchAll<
  Input extends As<any>,
  Cases extends InputCases<Input>,
>(input: Input, cases: Cases): ReturnType<Cases[keyof Cases]> {
  const mapper = (cases as any)[input._tag]
  const caseInput =
    "value" in input && Object.keys(input).length === 2 ? input.value : input
  return mapper(caseInput)
}

/**
 * @example
 * declare const input: Person | PersonNotFound
 * const result = std.pipe(
 *   input,
 *   tagged.foldAll({
 *     Person: (person) => person.name.value,
 *     PersonNotFound: (err) => err.name,
 *   }),
 * )
 * // PersonName | string
 */
export function fold<Input extends As<any>, Cases extends InputCases<Input>>(
  cases: Cases,
) {
  return (input: Input) => matchAll(input, cases)
}
// const flatMapAll = fold as <
//   Input extends TaggedAs<any>,
//   Cases extends InputCases<Input, TaggedAs>,
// >(
//   cases: Cases,
// ) => (input: Input) => ReturnType<Cases[keyof Cases]>

/**
 * @example
 * declare const input: Person | PersonNotFound
 * const result = std.pipe(
 *   value,
 *   tagged.fold({
 *     Person: (person) => person.name.valueOf(),
 *   }),
 * )
 * // string | PersonNotFound
 */
export function map<
  Input extends As<any>,
  Cases extends Partial<InputCases<Input>>,
>(cases: Cases) {
  return (input: Input) => match(input, cases)
}

/**
 * Can only return tagged types! Hence `flatMap` …
 * @example
 * declare const input: Person | PersonNotFound
 * const result = std.pipe(
 *   value,
 *   tagged.flatMap({
 *     Person: (person) => person.name,
 *     // more mappers if wanted.
 *   }),
 * )
 * // PersonName | PersonNotFound
 */
export const flatMap = map as <
  Input extends As<any>,
  Cases extends Partial<InputCases<Input, As>>,
>(
  cases: Cases,
) => (input: Input) => CaseReturnTypes<Input, Cases>[Input["_tag"]]
