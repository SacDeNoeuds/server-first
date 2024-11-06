import { Email, entity } from "@/std"

export type Account = entity.Object<{
  _tag: "Account"
  id: AccountId
  email: Email
}>
export type AccountId = entity.Value<string, "AccountId">

export const AccountId = entity.Id<AccountId>()
export const Account = entity.Object<Account>("Account", {
  id: AccountId,
  email: Email,
})
