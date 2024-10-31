import assert from "node:assert"
import { pipe } from "../core"
import { schema as S } from "./index"

const PersonName = pipe(
  S.string,
  S.map((name) => ({
    name,
    tag: "PersonName" as const,
  })),
)

const result1 = PersonName.decode("hello")
console.dir({ result1 }, { depth: null })

const PersonSchema = S.object({
  name: PersonName,
  birthDate: S.date,
})
const Person = pipe(
  PersonSchema,
  S.map((value) => {
    return {
      value,
      tag: "Person" as const,
    }
  }),
)

const result2 = Person.decode({
  name: "hello",
  birthDate: new Date("1992-09-15T00:00:00.000Z"),
})

console.dir({ result2 }, { depth: null })

const MapOfSize2 = pipe(
  S.Map(S.number, S.string),
  S.size({ min: 2, reason: "because" }),
)
const ArrayOfLength3 = pipe(
  S.array(S.number),
  S.size({ min: 3, reason: "because" }),
)
const SetOfSize3 = pipe(S.Set(S.number), S.size({ min: 3, reason: "because" }))
const DateAfter2000 = pipe(
  S.date,
  S.greaterThan(new Date(2000, 0, 1), "because I decided so"),
)
const numberBetween12And42 = pipe(
  S.number,
  S.between(12, 42, "because I decided so"),
)

const stringOrNumber = S.union(S.string, S.number)

const expectSuccess = (options: {
  because: string
  schema: S.Schema<any>
  value: any
}) => {
  const result = options.schema.decode(options.value)
  if (S.isFailure(result)) console.dir(result?.issues, { depth: 3 })
  assert.deepStrictEqual(result, options.value, options.because)
}
const expectFailure = (options: {
  because: string
  schema: S.Schema<any>
  value: any
}) => {
  const result = options.schema.decode(options.value)
  assert.ok(S.isFailure(result), options.because)
}

expectFailure({
  because: "undefined does not decode defined",
  schema: S.literal(undefined),
  value: "Hello World",
})

expectSuccess({
  because: "undefined decodes undefined",
  schema: S.literal(undefined),
  value: undefined,
})

expectSuccess({
  because: "optional string decodes string",
  schema: S.optional(S.string),
  value: "hello world",
})

expectFailure({
  because: "it fails decoding map with less than 2 elements",
  schema: MapOfSize2,
  value: new Map(),
})
expectSuccess({
  because: "it succeeds decoding map with more than 2 elements",
  schema: MapOfSize2,
  value: new Map([
    [42, "hello"],
    [43, "world"],
  ]),
})
expectFailure({ because: "arrayOfLength0", schema: ArrayOfLength3, value: [] })
expectSuccess({
  because: "arrayOfLength3",
  schema: ArrayOfLength3,
  value: [1, 2, 3],
})
expectFailure({ because: "SetOfSize0", schema: SetOfSize3, value: new Set() })
expectSuccess({
  because: "SetOfSize3",
  schema: SetOfSize3,
  value: new Set([1, 2, 3]),
})
expectSuccess({
  because: "date is after 2000",
  schema: DateAfter2000,
  value: new Date(),
})
expectFailure({
  because: "date is before 2000",
  schema: DateAfter2000,
  value: new Date(1999, 0, 1),
})
expectFailure({ because: "number10", schema: numberBetween12And42, value: 10 })
expectFailure({ because: "number43", schema: numberBetween12And42, value: 43 })
expectSuccess({ because: "number41", schema: numberBetween12And42, value: 41 })
expectSuccess({ because: "number13", schema: numberBetween12And42, value: 13 })
expectFailure({
  because: "a set of number fails decoding a set with strings",
  schema: S.Set(S.number),
  value: new Set(["a", 42, "c"]),
})
expectFailure({
  because: "an array of number fails decoding an array with strings",
  schema: S.Set(S.number),
  value: ["a", 42, "c"],
})
expectFailure({
  because: "veryNested",
  schema: S.object({
    numbers: S.array(S.object({ n: S.number })),
  }),
  value: { numbers: ["a", { n: 42 }, { n: "c" }] },
})
expectSuccess({
  because: "stringOrNumber01",
  schema: stringOrNumber,
  value: 42,
})
expectSuccess({
  because: "stringOrNumber02",
  schema: stringOrNumber,
  value: "hello",
})
expectFailure({
  because: "stringOrNumber03",
  schema: stringOrNumber,
  value: true,
})

expectSuccess({
  because: "smefwpof",
  schema: pipe(
    S.object({ name: S.string }),
    S.object.concat({ age: S.number }),
  ),
  value: { name: "hello", age: 42 },
})

// const subtractYears = (date: Date, n: number) => {
//   const copy = new Date(date)
//   copy.setFullYear(copy.getFullYear() - n)
//   return copy
// }
// const BirthDate = pipe(
//   S.date,
//   S.refine("must be 18+", (date) => {
//     const min = subtractYears(new Date(), 18)
//     return date.valueOf() > min.valueOf()
//   }),
// )

// const [err3, r3] = BirthDate.decode(new Date("1992-09-15T00:00:00.000Z"))
// console.dir({ err3, r3 }, { depth: null })
