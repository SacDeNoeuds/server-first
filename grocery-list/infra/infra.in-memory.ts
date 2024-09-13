import { InMemoryRepository } from "@/std/repository-in-memory"
import { AccountRepository } from "../domain/authentication/repository/account-repo"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

export const InfraInMemory = (): Infra => ({
  repository: {
    account: new AccountRepository(
      new InMemoryRepository({ mapId: (account) => account.email }),
    ),
    groceryList: new GroceryListRepository(
      new InMemoryRepository({ mapId: (list) => list.id }),
    ),
  },
})
