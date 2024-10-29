import type { std } from "@/std"
import type { Repository } from "@/std/repository"
import { StringId } from "@/std/string-id"
import { Account, AccountId } from "./account"

export class AccountRepository {
  constructor(private repo: Repository<Account>) {}

  getOrCreate = async (email: std.Email) => {
    const existingAccount = await this.repo.findByKey("email", email)
    const account =
      existingAccount ||
      (await this.repo.set(
        email.valueOf(),
        Account({
          id: AccountId(StringId()),
          email,
        }),
      ))
    return account
  }

  findByEmail = async (email: Account["email"]) => {
    return this.repo.findById(email)
  }
}

export class AccountNotFound {
  constructor(readonly email: string) {}
}
