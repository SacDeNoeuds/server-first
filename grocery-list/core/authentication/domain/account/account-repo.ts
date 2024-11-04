import { tagged, type Email } from "@/std"
import type { Repository } from "@/std/repository"
import { Account, AccountId } from "./account"

export class AccountRepository {
  constructor(private repo: Repository<Account>) {}

  getOrCreate = async (email: Email) => {
    const existingAccount = await this.repo.findByKey("email", email)
    const account =
      existingAccount ||
      (await this.repo.set(
        email,
        Account({
          id: AccountId.new(),
          email,
        }),
      ))
    return account
  }

  findByEmail = async (email: Account["email"]) => {
    return this.repo.findById(email)
  }
}

export class AccountNotFound extends tagged.Class("AccountNotFound")<{
  email?: Email
  apiKey?: string
}> {
  static fromEmail = (email: Email) => new AccountNotFound({ email })
  static fromApiKey = (apiKey: string) => new AccountNotFound({ apiKey })
}
