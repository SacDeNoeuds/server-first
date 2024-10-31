import { Email, entity } from "@/std"

export type Account = entity.Object<{
  _tag: "Account"
  id: AccountId
  email: Email
}>
export type AccountId = entity.OfType<string>

export const AccountId = entity.IdFor<AccountId>()
export const Account = entity.Object<Account>("Account", {
  id: AccountId,
  email: Email,
})
