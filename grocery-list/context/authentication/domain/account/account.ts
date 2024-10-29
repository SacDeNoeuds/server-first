import { std } from "@/std"

export type AccountId = std.Branded<string, "AccountId">
export const AccountId = std.BrandedId<AccountId>("AccountId")

export type Account = std.Tagged<{
  _tag: "Account"
  id: AccountId
  email: std.Email
}>
export const Account = std.TaggedEntity<Account>("Account", {
  id: AccountId,
  email: std.Email,
})
