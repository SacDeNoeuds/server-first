import { Account } from "./account"

console.dir(
  {
    account: Account.decode({
      _kind: "Account",
      id: "1wfvihtzec3",
      email: "thomas@me",
    }),
  },
  { depth: null },
)
