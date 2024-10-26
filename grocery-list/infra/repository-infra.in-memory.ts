import { JsonPatchRepository } from "@/json-patch/repository"
import { InMemoryRepository } from "@/std/repository-in-memory"
import { AccountRepository } from "@grocery-list/context/authentication/domain/account"
import { GroceryListRepository } from "@grocery-list/context/grocery-list/domain/grocery-list"
import type { RepositoryInfra } from "./repository-infra"

export const RepositoryInfraInMemory = (): RepositoryInfra => ({
  account: new AccountRepository(new InMemoryRepository()),
  groceryList: new GroceryListRepository(
    new JsonPatchRepository(new InMemoryRepository()),
  ),
})
