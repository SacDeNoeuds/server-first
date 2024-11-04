import { schema } from "@/std"
import assert from "node:assert"
import { Account } from "./account"

const result = Account.decode({
  _kind: "Account",
  id: "1wfvihtzec3",
  email: "thomas@me",
})

assert.ok(schema.isSuccess(result))
