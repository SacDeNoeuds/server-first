import { pipe } from "../core"
import {
  Tagged,
  TaggedClass,
  type TagOf,
  type ValueOf,
} from "./tagged-weird-idea-I-keep-for-history"

// test date
type BirthDate = Tagged<"BirthDate", Date>
const BirthDate = Tagged<BirthDate>("BirthDate")
type Test01 = TagOf<BirthDate>
type Test02 = ValueOf<BirthDate>

const now = new Date()
const birthDate = BirthDate(now)
console.info("--- birthDate ---")
console.info("value", birthDate)
console.info("year", birthDate.getFullYear())
console.info("json", JSON.parse(JSON.stringify(birthDate)))
console.info("strict eq", birthDate === BirthDate(now))
console.info("loose eq", birthDate == BirthDate(now))
console.info(
  "strict valueOf eq",
  birthDate.valueOf() === BirthDate(now).valueOf(),
)
console.info()

type PersonName = Tagged<"PersonName", string>

const PersonName = Tagged<PersonName>("PersonName")
type Test03 = TagOf<PersonName>
type Test04 = ValueOf<PersonName>

const jack = PersonName("Jack")
console.info("--- PersonName ---")
console.info("value", jack)
console.info("length", jack.length)
console.info("json", JSON.parse(JSON.stringify(jack)))
console.info("loose eq", jack == PersonName("Jack"))
console.info("strict eq with string", jack === "Jack")
console.info("loose eq with string", jack == "Jack")
console.info("strict valueOf eq", jack.valueOf() === "Jack")
console.info()

type PersonAge = Tagged<"PersonAge", number>
const PersonAge = Tagged<PersonAge>("PersonAge")
type Test05 = TagOf<PersonAge>
type Test06 = ValueOf<PersonAge>

const age = PersonAge(42)
console.info("--- PersonAge ---")
console.info("value", age)
console.info("strict eq", age === 42)
console.info("loose eq", age == 42)
console.info("json", JSON.parse(JSON.stringify(age)))
console.info()

class PersonNotFound extends TaggedClass("PersonNotFound")<{
  name: PersonName
}> {}
const notFound = new PersonNotFound({ name: PersonName("Jack") })
console.info("--- PersonNotFound ---")
console.info("class", notFound)
console.info("name", notFound.name)
console.info("json", JSON.parse(JSON.stringify(notFound)))
console.info()

// test matchers
console.info("--- Matchers ---")
class HttpError extends TaggedClass("HttpError")<{
  code: number
  cause?: unknown
}> {}
type Input = PersonName | BirthDate | PersonNotFound
const value = jack as Input

console.dir({
  test01: Tagged.matchAll(value, {
    BirthDate: (date) => date.valueOf(),
    PersonName: (name) => name.length,
    PersonNotFound: (err) => err.name.length,
  }),
  test02: pipe(
    value,
    Tagged.foldAll({
      BirthDate: (date) => date.valueOf(),
      PersonName: (name) => name.length,
      PersonNotFound: (err) => err.name.length,
    }),
  ),
  test03: Tagged.match(value, {
    BirthDate: (date) => new Date(date),
  }),
  test04: pipe(
    value,
    Tagged.fold({
      BirthDate: (date) => date.toISOString(),
      PersonName: (name) => {
        return name === "Mary" ? new HttpError({ code: 404 }) : name
      },
    }),
  ),
  // test05: pipe(
  //   value,
  //   Tagged.map("PersonName", (name) => {
  //     return name == "Mary" ? new HttpError({ code: 404 }) : name.valueOf()
  //   }),
  // ),
})
