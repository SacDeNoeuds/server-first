import { Kinded } from "./kinded"

type Person = Kinded<{
  _kind: "Person"
  name: string
  birthDate: Date
  age: number
}>
const Person = Kinded<Person>("Person")
const Jack = Person({
  name: "jack",
  birthDate: new Date(),
  age: 12,
})
console.info("--- Person ---")
console.info("value", Jack)
console.info("name", Jack.name)
console.info("json", JSON.parse(JSON.stringify(Jack)))
console.info()
