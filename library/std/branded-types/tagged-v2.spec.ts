import { pipe } from "../core"
import * as branded from "./branded"
import * as tagged from "./tagged-v2"

type PersonName = branded.Type<string, "PersonName">
class Person extends tagged.Class("Person")<{
  name: PersonName
  birthDate: Date
  age: number
}> {}
// const Person = tagged.object<Person>("Person")
const Jack = new Person({
  name: "jack" as PersonName,
  birthDate: new Date(),
  age: 12,
})
console.info("--- Person ---")
console.info("value", Jack)
console.info("name", Jack.name)
console.info()

class PersonNotFound extends tagged.Class("PersonNotFound")<{
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
  // match: PersonName | PersonNotFound
  match: tagged.match(input, {
    Person: (person) => person.name,
  }),
  // matchAll: PersonName
  matchAll: tagged.matchAll(input, {
    Person: (person) => person.name,
    PersonNotFound: (err) => err.name,
  }),
  // fold: PersonName | PersonNotFound
  fold: pipe(
    input,
    tagged.fold({
      Person: (person) => person.name,
      PersonNotFound: (err) => err,
    }),
  ),
})
