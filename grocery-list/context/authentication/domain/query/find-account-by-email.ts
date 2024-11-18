import type { Email } from "@/std"
import type { Account, AccountRepository } from ".."

export type FindAccountByEmail = (email: Email) => Promise<Account | undefined>
export const FindAccountByEmail =
  (repository: { account: AccountRepository }): FindAccountByEmail =>
  async (email) => {
    const account = email && (await repository.account.findByEmail(email))
    return account || undefined
  }
