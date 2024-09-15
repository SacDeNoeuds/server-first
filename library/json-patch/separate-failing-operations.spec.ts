import assert from "assert"
import { separateFailingOperations } from "./separate-failing-operations"

function test() {
  const original = { a: 1 }
  assert.deepStrictEqual(
    separateFailingOperations(original, [
      { op: "add", path: "/b", value: 2 },
      { op: "remove", path: "/c" },
    ]),
    {
      valid: [{ op: "add", path: "/b", value: 2 }],
      invalid: [{ op: "remove", path: "/c" }],
    },
  )
  assert.deepStrictEqual(original, { a: 1 })
  console.info("All good ✅")
}

test()
