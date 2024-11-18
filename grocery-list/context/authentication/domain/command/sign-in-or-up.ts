import type { Email } from "@/std"
import type { Account } from "../account"
import type { AccountRepository } from "../persistence/account-repo"

export type SignInOrUpCommand = (email: Email) => Promise<Account>
export const SignInOrUpCommand = (repository: {
  account: AccountRepository
}): SignInOrUpCommand => repository.account.getOrCreate
