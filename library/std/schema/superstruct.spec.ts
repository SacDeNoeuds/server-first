import * as S from "superstruct"

const MyNumber = S.coerce(S.number(), S.string(), (value) => parseFloat(value))
const a = S.create(42, MyNumber) // 42
const b = S.create("42", MyNumber) // 42

const TestName = S.coerce(
  S.object({ value: S.string() }),
  S.string(),
  (name) => ({
    value: name,
  }),
)
const TestSchema = S.object({
  name: TestName,
})
const Test = S.coerce(S.object({ value: TestSchema }), TestSchema, (name) => ({
  name,
}))

console.info({
  a,
  b,
  test1: Test.validate(
    { value: { name: "Test" } },
    { coerce: true, mask: true },
  ),
  test2: Test.validate(
    { value: { name: { value: "Test" } } },
    { coerce: true, mask: true },
  ),
  // FAILING POINT.
  test3: S.create({ name: "Test" }, Test),
})
// const c = S.create(false, MyNumber) // error thrown!
