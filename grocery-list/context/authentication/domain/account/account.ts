import { std } from "@/std"
import { schema as S } from "@/std/schema"

export type AccountId = std.Tagged<"AccountId", string>
export const AccountId = std.EntityValue<AccountId>("AccountId", {
  schema: S.string,
})

export type Account = std.Kinded<{
  _kind: "Account"
  id: AccountId
  email: std.Email
}>
export const Account = std.EntityObject<Account>("Account", {
  id: AccountId,
  email: std.Email,
})
