import { tagged } from "@/std"
import type { Email } from "@/std/email"
import type { Repository } from "@/std/repository"
import { AccountId } from "@shared/value-object/account-id"
import { Account } from "../account"

export class AccountRepository {
  constructor(private repo: Repository<Account>) {}

  getOrCreate = async (email: Email) => {
    const existingAccount = await this.repo.findByKey("email", email)
    const account =
      existingAccount ||
      (await this.repo.set(email, Account.from({ id: AccountId.new(), email })))
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
