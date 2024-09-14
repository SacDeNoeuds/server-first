import { JsonPatchRepository } from "@/json-patch/repository"
import { InMemoryRepository } from "@/std/repository-in-memory"
import { AccountRepository } from "../domain/authentication/repository/account-repo"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

export const InfraInMemory = (): Infra => ({
  repository: {
    account: new AccountRepository(new InMemoryRepository()),
    groceryList: new GroceryListRepository(
      new JsonPatchRepository(new InMemoryRepository()),
    ),
  },
})
