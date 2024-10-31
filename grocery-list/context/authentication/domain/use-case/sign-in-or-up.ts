import type { Email } from "@/std"
import type { Account, AccountRepository } from "../account"

export type SignInOrUp = (email: Email) => Promise<Account>
export const SignInOrUp = (repository: {
  account: AccountRepository
}): SignInOrUp => repository.account.getOrCreate
