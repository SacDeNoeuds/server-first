import type { std } from "@/std"
import type { Account, AccountRepository } from "../account"

export type SignInOrUp = (email: std.Email) => Promise<Account>
export const SignInOrUp = (repository: {
  account: AccountRepository
}): SignInOrUp => repository.account.getOrCreate
