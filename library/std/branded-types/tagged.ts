import type { Branded, ValueOf as ValueOfBranded } from "./branded"

export type TaggedShape = { readonly _tag: string }
export type Tagged<Value extends TaggedShape> = Branded<Value, Value["_tag"]>
export type ValueOfTagged<Value extends Branded<TaggedShape, string>> = Omit<
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
export function Tagged<T extends Branded<TaggedShape, string>>(tag: T["_tag"]) {
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
export function TaggedClass<Tag extends string>(
  tag: Tag,
): new <Value extends Record<string, any>>(value: Value) => Tagged<
  { _tag: Tag } & Value
> {
  return class {
    readonly _tag = tag
    constructor(value: Record<string, any>) {
      Object.assign(this, value)
    }
  } as any
}

type InputCases<Input extends TaggedShape> = {
  [Case in Input["_tag"]]: (
    value: Extract<Input, { readonly _tag: Case }>,
  ) => any
}

type ReturnsTypeOr<T, Fallback> = [T] extends [never]
  ? Fallback
  : T extends (...args: any[]) => infer R
  ? R
  : Fallback
type CaseReturnTypes<Input extends TaggedShape, Cases extends {}> = {
  [Tag in Input["_tag"]]: ReturnsTypeOr<
    Cases[Extract<Tag, keyof Cases>],
    Extract<Input, { readonly _tag: Tag }>
  >
}

/**
 * @example
 * declare const input: Person | PersonNotFound
 * const result = match(value, {
 *   PersonNotFound: (error) => error.personId,
 * })
 * // Person | PersonId
 */
Tagged.match = function match<
  Input extends TaggedShape,
  Cases extends Partial<InputCases<Input>>,
>(input: Input, cases: Cases): CaseReturnTypes<Input, Cases>[Input["_tag"]] {
  const mapper = (cases as any)[input._tag]
  return mapper ? mapper(input) : input
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = matchAll(value, {
 *    BirthDate: (date) => date.valueOf(),
 *    Person: (person) => person.name.length,
 *    PersonName: (name) => name.length,
 *    PersonNotFound: (err) => err.name,
 *  })
 * // number | PersonName
 */
Tagged.matchAll = function matchAll<
  Input extends TaggedShape,
  Cases extends InputCases<Input>,
>(input: Input, cases: Cases): ReturnType<Cases[keyof Cases]> {
  const mapper = (cases as any)[input._tag]
  return mapper(input)
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = pipe(
 *   input,
 *   foldAll({
 *     BirthDate: (date) => date.valueOf(),
 *     Person: (person) => person.name,
 *     PersonName: (name) => name.length,
 *     PersonNotFound: (err) => err.name,
 *   }),
 * )
 * // number | PersonName
 */
Tagged.foldAll = function foldAll<
  Input extends TaggedShape,
  Cases extends InputCases<Input>,
>(cases: Cases) {
  return (input: Input) => Tagged.matchAll(input, cases)
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = pipe(
 *   value,
 *   fold({
 *     Person: (person) => person.name.valueOf(),
 *   }),
 * )
 * // string | PersonName | BirthDate | PersonNotFound
 */
Tagged.fold = function fold<
  Input extends TaggedShape,
  Cases extends Partial<InputCases<Input>>,
>(cases: Cases) {
  return (input: Input) => Tagged.match(input, cases)
}
