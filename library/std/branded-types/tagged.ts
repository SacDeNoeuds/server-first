const symbolForTag: unique symbol = Symbol("tag")
const symbolForValue: unique symbol = Symbol("value")

type PrimitiveAsObject<T, Fallback = T> = T extends string
  ? String
  : T extends number
  ? Number
  : T extends boolean
  ? Boolean
  : T extends symbol
  ? Symbol
  : Fallback

export type Tagged<Tag extends string, Value> = Value &
  PrimitiveAsObject<Value> & {
    readonly [symbolForTag]: Tag
    readonly [symbolForValue]: Value
    [Symbol.toPrimitive]: () => Value
  }

export type TagOf<T> = T extends { [symbolForTag]: infer Tag } ? Tag : never
export type ValueOf<T> = T extends { [symbolForValue]: infer U } ? U : never

function defineTaggedProperties(
  target: object,
  tag: string,
  original: unknown,
) {
  Object.defineProperties(target, {
    [symbolForTag]: {
      value: tag,
      enumerable: false,
      configurable: false,
      writable: false,
    },
    [symbolForValue]: {
      get: () => original,
      enumerable: false,
      configurable: false,
    },
    [Symbol.toPrimitive]: {
      value: (original as any)?.[Symbol.toPrimitive] ?? (() => original),
      enumerable: false,
      configurable: false,
    },
    [Symbol.toStringTag]: {
      value:
        (original as any)?.[Symbol.toStringTag] ?? (original as any)?.toString,
      enumerable: false,
      configurable: false,
    },
    toJSON: {
      value: (original as any)?.toJSON ?? (() => original),
      enumerable: false,
      configurable: false,
    },
  })
}

/**
 * @example
 * type BirthDate = Tagged<"BirthDate", Date>
 * const BirthDate = Tagged<BirthDate>("BirthDate")
 * const birthDate = BirthDate(new Date())
 *
 * type PersonName = Tagged<"PersonName", string>
 * const PersonName = Tagged<PersonName>("PersonName")
 *
 * type Person = TaggedStruct<{
 *   _tag: "Person"
 *   name: PersonName
 *   birthDate: BirthDate
 * }>
 * const Person = Tagged<Person>("Person")
 */
export const Tagged =
  <T extends Tagged<string, any>>(tag: TagOf<T> & string) =>
  (original: ValueOf<T>) => {
    const Constructor: any = original?.constructor ?? Object
    const value = new Constructor(original)
    defineTaggedProperties(value, tag, original)
    return value as T
  }

Tagged.isTaggedAs =
  <Target extends Tagged<string, any>>(tag: TagOf<Target>) =>
  (input: Tagged<any, any> | Target): input is Target => {
    // @ts-ignore
    return input?.[symbolForTag] === tag
  }

/**
 * @example
 * class PersonNotFound extends Kinded("PersonNotFound")<{
 *   name: PersonName
 * }> {}
 * const error = new PersonNotFound({ name: PersonName("Jack") })
 *
 * class Person extends Kinded("Person")<{
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
): new <Value>(value: Value) => Tagged<Tag, Value> {
  return class {
    constructor(value: Record<string, any>) {
      Object.assign(this, value)
      defineTaggedProperties(this, tag, value)
    }
  } as any
}

type InputCases<Input extends Tagged<string, any>> = {
  [Case in TagOf<Input> & string]: (
    value: ValueOf<Extract<Input, { readonly [symbolForTag]: Case }>>,
    tagged: Extract<Input, { readonly [symbolForTag]: Case }>,
  ) => any
}

type ReturnsTypeOr<T, Fallback> = [T] extends [never]
  ? Fallback
  : T extends (...args: any[]) => infer R
  ? R
  : Fallback
type CaseReturnTypes<Input extends Tagged<string, any>, Cases extends {}> = {
  [Tag in TagOf<Input> & string]: ReturnsTypeOr<
    Cases[Extract<Tag, keyof Cases> & string],
    Extract<Input, { readonly [symbolForTag]: Tag }>
  >
}

/**
 * @example
 * declare const input: Person | PersonName | BirthDate | PersonNotFound
 * const result = match(value, {
 *   BirthDate: (date) => new Date(date),
 *   Person: (person) => person.name.valueOf(),
 * })
 * // string | Date | PersonName | PersonNotFound
 */
Tagged.match = function match<
  Input extends Tagged<string, any>,
  Cases extends Partial<InputCases<Input>>,
>(
  input: Input,
  cases: Cases,
): CaseReturnTypes<Input, Cases>[TagOf<Input> & string] {
  const mapper = (cases as any)[(input as any)[symbolForTag]]
  return mapper ? mapper((input as any)[symbolForValue], input) : input
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
Tagged.matchAll = function matchAll<Input, Cases extends InputCases<Input>>(
  input: Input,
  cases: Cases,
): ReturnType<Cases[keyof Cases]> {
  const mapper = (cases as any)[(input as any)[symbolForTag]]
  return mapper((input as any)[symbolForValue], input)
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
Tagged.foldAll =
  <Input, Cases extends InputCases<Input>>(cases: Cases) =>
  (input: Input): ReturnType<Cases[keyof Cases]> =>
    Tagged.matchAll(input, cases)

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
Tagged.fold =
  <Input, Cases extends Partial<InputCases<Input>>>(cases: Cases) =>
  (input: Input) =>
    Tagged.match(input, cases)

// /**
//  * @example
//  * declare const value: Person | PersonNotFound
//  * const result = pipe(
//  *   value,
//  *   map("Person", (person) => person.name.valueOf()),
//  * )
//  * // string | PersonNotFound
//  */
// Tagged.map =
//   <Input, Tag extends TagOf<Input> & string, R>(
//     tag: Tag,
//     mapper: (input: Extract<Input, { readonly [symbolForTag]: Tag }>) => R,
//   ) =>
//   (input: Input) =>
//     Tagged.matchSome(input, {
//       [tag as any]: mapper,
//     } as any) as
//       | R
//       | Extract<Input, { readonly [symbolForTag]: Exclude<TagOf<Input>, Tag> }>
