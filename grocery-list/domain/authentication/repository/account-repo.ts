import type { Repository } from "@/std/repository"
import type { Account } from "../entity/account"

export class AccountRepository {
  constructor(private repo: Repository<Account>) {}

  getOrCreate = async (email: Account["email"]) => {
    const existingAccount = await this.repo.findById(email)
    const account =
      existingAccount ||
      (await this.repo.set(email, { email, groceryLists: [] }))
    return account
  }

  findByEmail = async (email: Account["email"]) => {
    return this.repo.findById(email)
  }

  addGroceryList = async (email: Account["email"], groceryListId: string) => {
    const account = await this.repo.findById(email)
    if (!account) return new AccountNotFound(email)

    account.groceryLists.push(groceryListId)
    await this.repo.set(account.email, account)
    return account
  }
}

export class AccountNotFound {
  constructor(readonly email: string) {}
}
