import type { Account, AccountRepository } from "../account"

export type SignInOrUp = (email: string) => Promise<Account>
export const SignInOrUp = (repository: {
  account: AccountRepository
}): SignInOrUp => repository.account.getOrCreate
