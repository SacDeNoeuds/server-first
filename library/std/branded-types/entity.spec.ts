import { pipe } from "../core"
import * as S from "../schema"
import * as entity from "./entity"

type PersonName = entity.OfType<string>
const PersonName = entity.fromSchema<PersonName>(S.string)

const result1 = PersonName.decode("hello")
console.dir({ result1 }, { depth: null })

const subtractYears = (date: Date, n: number) => {
  const copy = new Date(date)
  copy.setFullYear(copy.getFullYear() - n)
  return copy
}

type BirthDate = entity.OfType<Date, "BirthDate">
const BirthDate = pipe(
  S.date,
  S.refine("must be 18+", (date) => {
    const min = subtractYears(new Date(), 18)
    return date.valueOf() < min.valueOf()
  }),
  entity.fromSchema<BirthDate>,
)

const result2 = BirthDate.decode(new Date("1992-09-15T00:00:00.000Z"))
console.dir({ result2 }, { depth: null })

type Person = entity.Object<{
  _tag: "Person"
  name: PersonName
  birthDate: BirthDate
}>
const Person = entity.Object<Person>("Person", {
  name: PersonName,
  birthDate: BirthDate,
})

const result3 = Person.decode({
  _tag: "Person",
  name: "hello",
  birthDate: new Date("1992-09-15T00:00:00.000Z"),
})

console.dir({ result3 }, { depth: null })

const person = Person({
  birthDate: BirthDate(new Date("2000-01-01T00:00:00.000Z")),
  name: PersonName("hello"),
})
console.dir({ person })
