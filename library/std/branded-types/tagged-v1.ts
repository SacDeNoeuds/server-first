// import type { Brand, BaseOf as ValueOfBranded } from "./branded"

// export type Shape = { readonly _tag: string }
// export type Object<Value extends Shape> = Brand<Value, Value["_tag"]>
// export type ValueOf<Value extends Brand<Shape, string>> = Omit<
//   ValueOfBranded<Value>,
//   "_tag"
// >

// /**
//  * @example
//  * import { tagged } from '@/std'
//  *
//  * type Person = tagged.Object<{
//  *   _tag: "Person"
//  *   name: PersonName
//  *   birthDate: BirthDate
//  * }>
//  * const Person = fromTag<Person>("Person")
//  * const Jack = Person({
//  *   name: "jack" as PersonName,
//  *   birthDate: new Date(),
//  *   age: 12,
//  *})
//  */
// export function fromTag<T extends Brand<Shape, string>>(tag: T["_tag"]) {
//   return (value: Omit<ValueOfBranded<T>, "_tag">): T => {
//     return { ...(value as any), _tag: tag }
//   }
// }

// export function isTaggedAs<Target extends Shape>(tag: Target["_tag"]) {
//   return <Input extends Shape>(input: Input | Target): input is Target => {
//     return input._tag === tag
//   }
// }

// export function mapOnly<T extends Shape>(tag: T["_tag"]) {
//   const isT = isTaggedAs(tag)
//   return <Output>(mapper: (input: T) => Output) => {
//     return <Input extends Shape>(input: Input | T) => {
//       return isT(input) ? mapper(input) : input
//     }
//   }
// }

// export function mapNot<T extends Shape>(tag: T["_tag"]) {
//   const isT = isTaggedAs(tag)
//   return <Input extends Shape, Output>(mapper: (input: Input) => Output) => {
//     return (input: Input | T) => {
//       return isT(input) ? input : mapper(input)
//     }
//   }
// }

// /**
//  * @example
//  * import { tagged } from '@/std'
//  *
//  * class PersonNotFound extends tagged.Class("PersonNotFound")<{
//  *   name: PersonName
//  * }> {}
//  * const error = new PersonNotFound({ name: PersonName("Jack") })
//  *
//  * class Person extends tagged.Class("Person")<{
//  *   name: PersonName
//  *   birthDate: BirthDate
//  *   age: PersonAge
//  * }> {}
//  *
//  * const Jack = new Person({
//  *   name: PersonName("Jack"),
//  *   birthDate: BirthDate(new Date()),
//  *   age: PersonAge(42),
//  * })
//  */
// export function Class<Tag extends string>(
//   tag: Tag,
// ): new <Value extends Record<string, any>>(
//   ...args: {} extends Value ? [Value?] : [Value]
// ) => Object<{ _tag: Tag } & Value> {
//   return class {
//     readonly _tag = tag
//     constructor(value?: Record<string, any>) {
//       Object.assign(this, value)
//     }
//   } as any
// }

// type InputCases<Input extends Shape> = {
//   [Case in Input["_tag"]]: (
//     value: Extract<Input, { readonly _tag: Case }>,
//   ) => any
// }

// type ReturnTypeOr<T, Fallback> = [T] extends [never]
//   ? Fallback
//   : T extends (...args: any[]) => infer R
//   ? R
//   : Fallback
// type CaseReturnTypes<Input extends Shape, Cases extends {}> = {
//   [Tag in Input["_tag"]]: ReturnTypeOr<
//     Cases[Extract<Tag, keyof Cases>],
//     Extract<Input, { readonly _tag: Tag }>
//   >
// }

// /**
//  * @example
//  * declare const input: Person | PersonNotFound
//  * const result = tagged.match(value, {
//  *   PersonNotFound: (error) => error.personId,
//  * })
//  * // Person | PersonId
//  */
// export function match<
//   Input extends Shape,
//   Cases extends Partial<InputCases<Input>>,
// >(input: Input, cases: Cases): CaseReturnTypes<Input, Cases>[Input["_tag"]] {
//   const mapper = (cases as any)[input._tag]
//   return mapper ? mapper(input) : input
// }

// /**
//  * @example
//  * declare const input: Person | PersonNotFound
//  * const result = tagged.matchAll(value, {
//  *    Person: (person) => person.name.length,
//  *    PersonNotFound: (err) => err.name,
//  *  })
//  * // number | PersonName
//  */
// export function matchAll<Input extends Shape, Cases extends InputCases<Input>>(
//   input: Input,
//   cases: Cases,
// ): ReturnType<Cases[keyof Cases]> {
//   const mapper = (cases as any)[input._tag]
//   return mapper(input)
// }

// /**
//  * @example
//  * declare const input: Person | PersonNotFound
//  * const result = std.pipe(
//  *   input,
//  *   tagged.foldAll({
//  *     Person: (person) => person.name,
//  *     PersonNotFound: (err) => err.name,
//  *   }),
//  * )
//  * // PersonName
//  */
// export function foldAll<Input extends Shape, Cases extends InputCases<Input>>(
//   cases: Cases,
// ) {
//   return (input: Input) => matchAll(input, cases)
// }

// /**
//  * @example
//  * declare const input: Person | PersonNotFound
//  * const result = std.pipe(
//  *   value,
//  *   tagged.fold({
//  *     Person: (person) => person.name.valueOf(),
//  *   }),
//  * )
//  * // string | PersonNotFound
//  */
// export function fold<
//   Input extends Shape,
//   Cases extends Partial<InputCases<Input>>,
// >(cases: Cases) {
//   return (input: Input) => match(input, cases)
// }
