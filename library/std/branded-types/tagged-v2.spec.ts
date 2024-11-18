import { pipe } from "../core"
import * as branded from "./branded"
import * as tagged from "./tagged-v2"

type PersonName = branded.Type<string, "PersonName">
type Person = tagged.Object<{
  _tag: "Person"
  name: PersonName
  birthDate: Date
  age: number
}>
const Person = tagged.fromObject<Person>("Person")
const Jack = Person({
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
  match: tagged.match(input, {
    Person: (person) => person.name,
  }),
  matchAll: tagged.matchAll(input, {
    Person: (person) => person.name,
    PersonNotFound: (err) => err.name,
  }),
  fold: pipe(
    input,
    tagged.fold({
      Person: (person) => person.name,
      PersonNotFound: (err) => err,
    }),
  ),
  // foldAll: pipe(
  //   input,
  //   tagged.foldAll({
  //     Person: (person) => person.name,
  //     PersonNotFound: (err) => err._tag,
  //   }),
  // ),
})

// console.info("--- mapOnly ---")
// const mapPerson = mapOnly<Person>("Person")
// console.info({
//   mapped: pipe(
//     input,
//     mapPerson((person) => person.name),
//     (v) => v,
//   ),
// })
// console.info()

// console.info("--- mapNot ---")
// const mapNotPerson = mapNot<Person>("Person")
// console.info({
//   mapped: pipe(
//     input,
//     mapNotPerson((err) => err.name),
//     (v) => v,
//   ),
// })
// console.info()
