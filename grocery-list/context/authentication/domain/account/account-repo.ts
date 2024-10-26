import type { Repository } from "@/std/repository"
import { StringId } from "@/std/string-id"
import { AccountId, type Account } from "./account"

export class AccountRepository {
  constructor(private repo: Repository<Account>) {}

  getOrCreate = async (email: Account["email"]) => {
    const existingAccount = await this.repo.findByKey("email", email)
    const account =
      existingAccount ||
      (await this.repo.set(email, {
        id: AccountId.fromString(StringId()),
        email,
      }))
    return account
  }

  findByEmail = async (email: Account["email"]) => {
    return this.repo.findById(email)
  }
}

export class AccountNotFound {
  constructor(readonly email: string) {}
}
