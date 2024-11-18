import { entity } from "@/std"
import { Email } from "@/std/email"
import { AccountId } from "@shared/value-object/account-id"

export type Account = entity.Object<{
  _tag: "Account"
  id: AccountId
  email: Email
}>

export const Account = entity.object<Account>("Account", {
  id: AccountId.schema,
  email: Email.schema,
})
