import { pipe } from "../core"
import type { Branded } from "./branded"
import { Tagged, TaggedClass } from "./tagged"

type PersonName = Branded<string, "PersonName">
type Person = Tagged<{
  _tag: "Person"
  name: PersonName
  birthDate: Date
  age: number
}>
const Person = Tagged<Person>("Person")
const Jack = Person({
  name: "jack" as PersonName,
  birthDate: new Date(),
  age: 12,
})
console.info("--- Person ---")
console.info("value", Jack)
console.info("name", Jack.name)
console.info()

class PersonNotFound extends TaggedClass("PersonNotFound")<{
  name: PersonName
}> {}
const err = new PersonNotFound({ name: "Jack" as PersonName })
console.info("--- PersonNotFound ---")
console.info("value", err)
console.info("name", err.name)
console.info()

type Input = Person | PersonNotFound
const input = Jack as Input
console.info("--- match ---")
console.info({
  match: Tagged.match(input, {
    Person: (person) => person.name,
  }),
  matchAll: Tagged.matchAll(input, {
    Person: (person) => person.name,
    PersonNotFound: (err) => err.name,
  }),
  fold: pipe(
    input,
    Tagged.fold({
      Person: (person) => person.name,
    }),
  ),
  foldAll: pipe(
    input,
    Tagged.foldAll({
      Person: (person) => person.name,
      PersonNotFound: (err) => err._tag,
    }),
  ),
})
