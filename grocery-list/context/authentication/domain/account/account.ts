import { std } from "@/std"
import { schema as S } from "@/std/schema"

export type AccountId = std.Branded<string, "AccountId">
export const AccountId = std.BrandedEntity<AccountId>("AccountId", {
  schema: S.string,
})

export type Account = std.Tagged<{
  _tag: "Account"
  id: AccountId
  email: std.Email
}>
export const Account = std.TaggedEntity<Account>("Account", {
  id: AccountId,
  email: std.Email,
})
