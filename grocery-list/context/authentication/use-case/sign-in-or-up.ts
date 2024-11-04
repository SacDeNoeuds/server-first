import type { Email } from "@/std"
import type { Account, AccountRepository } from "../domain"

export type SignInOrUp = (email: Email) => Promise<Account>
export const SignInOrUp = (repository: {
  account: AccountRepository
}): SignInOrUp => repository.account.getOrCreate
