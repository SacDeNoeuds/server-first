import { pipe } from "../core"
import * as S from "../schema"
import * as branded from "./branded"
import * as entity from "./entity"
import * as valueObject from "./value-object"

type Name = branded.Type<string, "Name">
const Name = pipe(S.string, valueObject.fromSchema<Name>)

const result1 = Name.schema.decode("hello")
console.dir({ result1 }, { depth: null })

// const Nationality: S.Schema<Nationality> = S.literal("US", "FR")
type Nationality = branded.Type<"FR" | "US", "Nationality">
const Nationality = pipe(
  S.literal("US", "FR"),
  valueObject.fromSchema<Nationality>,
)

const getMajorityAgePerNationality = (nationality: Nationality): number => {
  switch (nationality as branded.BaseOf<Nationality>) {
    case "FR":
      return 18
    case "US":
      return 21
  }
}

type BirthDate = branded.Type<Date, "BirthDate">
const BirthDate = pipe(S.date, valueObject.fromSchema<BirthDate>)

const subtractYears = (date: Date, n: number) => {
  const copy = new Date(date)
  copy.setFullYear(copy.getFullYear() - n)
  return copy
}

const result2 = BirthDate.schema.decode(new Date("1992-09-15T00:00:00.000Z"))
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
  entity.object<Person>("Person", {
    name: Name.schema,
    birthDate: BirthDate.schema,
    nationality: Nationality.schema,
  }),
  entity.applyRules({
    isMajor,
    isNotCalamityJane,
  }),
)

const result3 = Person.schema.decode({
  _tag: "Person",
  name: "hello",
  birthDate: new Date("1992-09-15T00:00:00.000Z"),
})

const personLike = {
  name: Name.from("Toto"),
  birthDate: BirthDate.from(new Date()),
  nationality: "FR" as Nationality,
}
const errors = entity.validate(personLike, Person.rules)

console.dir({ result3 }, { depth: null })

const person = Person.from({
  birthDate: BirthDate.from(new Date("1992-09-15T00:00:00Z")),
  nationality: Nationality.from("FR"),
  name: Name.from("hello"),
})
console.dir({ person })
