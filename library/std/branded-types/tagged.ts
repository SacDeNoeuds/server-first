import type { Brand, ValueOf as ValueOfBranded } from "./brand"

export type Shape = { readonly _tag: string }
export type Tagged<Value extends Shape> = Brand<Value, Value["_tag"]>
export type ValueOf<Value extends Brand<Shape, string>> = Omit<
  ValueOfBranded<Value>,
  "_tag"
>

// function isTaggedAs
//   <Target extends KindedShape>(tag: TagOf<Target>) {
//     return (input: Tagged<any, any> | Target): input is Target => {
//       // @ts-ignore
//       return input?.[symbolForTag] === tag
//     }
//   }

/**
 * @example
 * type BirthDate = Tagged<"BirthDate", Date>
 * const BirthDate = Tagged<BirthDate>("BirthDate")
 * const birthDate = BirthDate(new Date())
 *
 * type PersonName = Tagged<"PersonName", string>
 * const PersonName = Tagged<PersonName>("PersonName")
 *
 * type Person = Kinded<{
 *   _tag: "Person"
 *   name: PersonName
 *   birthDate: BirthDate
 * }>
 * const Person = Tagged<Person>("Person")
 */
export function fromTag<T extends Brand<Shape, string>>(tag: T["_tag"]) {
  return (value: Omit<ValueOfBranded<T>, "_tag">): T => {
    return { ...(value as any), _tag: tag }
  }
}

/**
 * @example
 * class PersonNotFound extends TaggedClass("PersonNotFound")<{
 *   name: PersonName
 * }> {}
 * const error = new PersonNotFound({ name: PersonName("Jack") })
 *
 * class Person extends TaggedClass("Person")<{
 *   name: PersonName
 *   birthDate: BirthDate
 *   age: PersonAge
 * }> {}
 * const Jack = new Person({
 *   name: PersonName("Jack"),
 *   birthDate: BirthDate(new Date()),
 *   age: PersonAge(42),
 * })
 */
export function Class<Tag extends string>(
  tag: Tag,
): new <Value extends Record<string, any>>(
  ...args: {} extends Value ? [] : [Value]
) => Tagged<{ _tag: Tag } & Value> {
  return class {
    readonly _tag = tag
    constructor(value?: Record<string, any>) {
      Object.assign(this, value)
    }
  } as any
}

type InputCases<Input extends Shape> = {
  [Case in Input["_tag"]]: (
    value: Extract<Input, { readonly _tag: Case }>,
  ) => any
}

type ReturnsTypeOr<T, Fallback> = [T] extends [never]
  ? Fallback
  : T extends (...args: any[]) => infer R
  ? R
  : Fallback
type CaseReturnTypes<Input extends Shape, Cases extends {}> = {
  [Tag in Input["_tag"]]: ReturnsTypeOr<
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
  Input extends Shape,
  Cases extends Partial<InputCases<Input>>,
>(input: Input, cases: Cases): CaseReturnTypes<Input, Cases>[Input["_tag"]] {
  const mapper = (cases as any)[input._tag]
  return mapper ? mapper(input) : input
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = tagged.matchAll(value, {
 *    BirthDate: (date) => date.valueOf(),
 *    Person: (person) => person.name.length,
 *    PersonName: (name) => name.length,
 *    PersonNotFound: (err) => err.name,
 *  })
 * // number | PersonName
 */
export function matchAll<Input extends Shape, Cases extends InputCases<Input>>(
  input: Input,
  cases: Cases,
): ReturnType<Cases[keyof Cases]> {
  const mapper = (cases as any)[input._tag]
  return mapper(input)
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = std.pipe(
 *   input,
 *   tagged.foldAll({
 *     BirthDate: (date) => date.valueOf(),
 *     Person: (person) => person.name,
 *     PersonName: (name) => name.length,
 *     PersonNotFound: (err) => err.name,
 *   }),
 * )
 * // number | PersonName
 */
export function foldAll<Input extends Shape, Cases extends InputCases<Input>>(
  cases: Cases,
) {
  return (input: Input) => matchAll(input, cases)
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = std.pipe(
 *   value,
 *   tagged.fold({
 *     Person: (person) => person.name.valueOf(),
 *   }),
 * )
 * // string | PersonName | BirthDate | PersonNotFound
 */
export function fold<
  Input extends Shape,
  Cases extends Partial<InputCases<Input>>,
>(cases: Cases) {
  return (input: Input) => match(input, cases)
}
