import assert from "assert"
import { isObject } from "./object"

function test() {
  assert.strictEqual(isObject({}), true, "empty record is a record")
  assert.strictEqual(isObject({ a: "b" }), true, "populated record is a record")
  assert.strictEqual(isObject(null), false, "null is not a record")
  assert.strictEqual(isObject(undefined), false, "undefined is not a record")
  assert.strictEqual(isObject(0), false, "0 is not a record")
  assert.strictEqual(isObject(""), false, '"" is not a record')
  console.info("all good ✅")
}
test()
