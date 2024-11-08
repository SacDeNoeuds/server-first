import { JsonPatchRepository } from "@/json-patch/repository"
import { InMemoryRepository } from "@/std/repository"
import { AccountRepository } from "@domain/authentication/domain"
import { groceryList } from "@domain/grocery-list"
import { GroceryListRepository } from "@domain/grocery-list/domain"
import type { RepositoryInfra } from "./repository-infra"

export const RepositoryInfraInMemory = (): RepositoryInfra => ({
  account: new AccountRepository(new InMemoryRepository()),
  groceryList: new GroceryListRepository(
    new JsonPatchRepository({
      repo: new InMemoryRepository(),
      schema: groceryList.GroceryList,
    }),
  ),
})
