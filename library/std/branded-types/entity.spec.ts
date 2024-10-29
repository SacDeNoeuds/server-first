import { pipe } from "../core"
import { schema as S } from "../schema"
import { EntityObject, EntityValue } from "./entity"
import type { Kinded } from "./kinded"
import type { Tagged } from "./tagged"

type PersonName = Tagged<"PersonName", string>
const PersonName = EntityValue<PersonName>("PersonName", {
  schema: S.string,
})

const result1 = PersonName.decode("hello")
console.dir({ result1 }, { depth: null })

const subtractYears = (date: Date, n: number) => {
  const copy = new Date(date)
  copy.setFullYear(copy.getFullYear() - n)
  return copy
}

type BirthDate = Tagged<"BirthDate", Date>
const BirthDate = EntityValue<BirthDate>("BirthDate", {
  schema: pipe(
    S.date,
    S.refine("must be 18+", (date) => {
      const min = subtractYears(new Date(), 18)
      return date.valueOf() < min.valueOf()
    }),
  ),
})

const result2 = BirthDate.decode(new Date("1992-09-15T00:00:00.000Z"))
// @ts-ignore
console.dir({ result2 }, { depth: null })

type Person = Kinded<{
  _kind: "Person"
  name: PersonName
  birthDate: BirthDate
}>
const Person = EntityObject<Person>("Person", {
  name: PersonName,
  birthDate: BirthDate,
})

const result3 = Person.decode({
  _kind: "Person",
  name: "hello",
  birthDate: new Date("1992-09-15T00:00:00.000Z"),
})

console.dir({ result3 }, { depth: null })
