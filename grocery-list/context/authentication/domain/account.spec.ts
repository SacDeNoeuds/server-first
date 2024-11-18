import { schema } from "@/std"
import assert from "node:assert"
import { Account } from "./account"

const result = Account.schema.decode({
  _tag: "Account",
  id: "1wfvihtzec3",
  email: "thomas@me",
})

assert.ok(schema.isSuccess(result))
