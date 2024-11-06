import { pipe } from "../core"
import * as S from "../schema"
import * as entity from "./entity"

type Name = entity.Value<string, "Name">
const Name = entity.fromSchema<Name>(S.string)

const result1 = Name.decode("hello")
console.dir({ result1 }, { depth: null })

// const Nationality: S.Schema<Nationality> = S.literal("US", "FR")
type Nationality = entity.Value<"FR" | "US", "Nationality">
const Nationality = entity.fromSchema<Nationality>(S.literal("US", "FR"))

const getMajorityAgePerNationality = (nationality: Nationality): number => {
  switch (nationality as entity.ValueOf<Nationality>) {
    case "FR":
      return 18
    case "US":
      return 21
  }
}

type BirthDate = entity.Value<Date, "BirthDate">
const BirthDate = entity.fromSchema<BirthDate>(S.date)

const subtractYears = (date: Date, n: number) => {
  const copy = new Date(date)
  copy.setFullYear(copy.getFullYear() - n)
  return copy
}

const result2 = BirthDate.decode(new Date("1992-09-15T00:00:00.000Z"))
console.dir({ result2 }, { depth: null })

type Person = entity.Object<{
  _tag: "Person"
  name: Name
  birthDate: Date
  nationality: Nationality
}>

const isMajor = (
  person: Pick<Person, "nationality" | "birthDate">,
): boolean => {
  const ageToBeMajor = getMajorityAgePerNationality(person.nationality)
  const minDate = subtractYears(new Date(), ageToBeMajor)
  return person.birthDate.valueOf() > minDate.valueOf()
}
const isNotCalamityJane = (person: Pick<Person, "name">): boolean => {
  return person.name !== "Calamity Jane"
}

const Person = pipe(
  entity.Object<Person>("Person", {
    name: Name,
    birthDate: BirthDate,
    nationality: Nationality,
  }),
  entity.applyRules({
    isMajor,
    isNotCalamityJane,
  }),
)

const result3 = Person.decode({
  _tag: "Person",
  name: "hello",
  birthDate: new Date("1992-09-15T00:00:00.000Z"),
})

const personLike = {
  name: Name("Toto"),
  birthDate: BirthDate(new Date()),
  nationality: "FR" as Nationality,
}
const errors = entity.validate(personLike, Person.rules)

console.dir({ result3 }, { depth: null })

const person = Person({
  birthDate: BirthDate(new Date("1992-09-15T00:00:00Z")),
  nationality: Nationality("FR"),
  name: Name("hello"),
})
console.dir({ person })
