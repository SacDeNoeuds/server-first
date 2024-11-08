import { Email, entity, valueObjectId } from "@/std"

export type Account = entity.Of<{
  _tag: "Account"
  id: AccountId
  email: Email
}>
export type AccountId = valueObjectId.Of<string, "AccountId">

export const AccountId = valueObjectId.for<AccountId>()
export const Account = entity.for<Account>("Account", {
  id: AccountId,
  email: Email,
})
