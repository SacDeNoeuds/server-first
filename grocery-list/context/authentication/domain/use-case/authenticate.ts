import type { Account, AccountRepository } from "../account"

export type Authenticate = (email: string) => Promise<Account | undefined>
export const Authenticate =
  (repository: { account: AccountRepository }): Authenticate =>
  async (email) => {
    const account = email && (await repository.account.findByEmail(email))
    return account || undefined
  }
