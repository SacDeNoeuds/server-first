// import { pipe } from "../core"
// import type { Brand } from "./branded"
// import {
//   Class,
//   fold,
//   foldAll,
//   fromTag,
//   mapNot,
//   mapOnly,
//   match,
//   matchAll,
//   type Object,
// } from "./tagged-v1"

// type PersonName = Brand<string, "PersonName">
// type Person = Object<{
//   _tag: "Person"
//   name: PersonName
//   birthDate: Date
//   age: number
// }>
// const Person = fromTag<Person>("Person")
// const Jack = Person({
//   name: "jack" as PersonName,
//   birthDate: new Date(),
//   age: 12,
// })
// console.info("--- Person ---")
// console.info("value", Jack)
// console.info("name", Jack.name)
// console.info()

// class PersonNotFound extends Class("PersonNotFound")<{
//   name: PersonName
// }> {}
// const err = new PersonNotFound({ name: "Jack" as PersonName })
// console.info("--- PersonNotFound ---")
// console.info("value", err)
// console.info("name", err.name)
// console.info()

// type Input = Person | PersonNotFound
// const input = Jack as Input
// console.info("--- match ---")
// console.info({
//   match: match(input, {
//     Person: (person) => person.name,
//   }),
//   matchAll: matchAll(input, {
//     Person: (person) => person.name,
//     PersonNotFound: (err) => err.name,
//   }),
//   fold: pipe(
//     input,
//     fold({
//       Person: (person) => person.name,
//     }),
//   ),
//   foldAll: pipe(
//     input,
//     foldAll({
//       Person: (person) => person.name,
//       PersonNotFound: (err) => err._tag,
//     }),
//   ),
// })

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
