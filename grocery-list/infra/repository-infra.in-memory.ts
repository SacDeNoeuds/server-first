import { JsonPatchRepository } from "@/json-patch/repository"
import { std } from "@/std"
import { InMemoryRepository } from "@/std/repository"
import { schema as S } from "@/std/schema"
import { AccountRepository } from "@domain/authentication/domain/account"
import { groceryList } from "@domain/grocery-list"
import { GroceryListRepository } from "@domain/grocery-list/domain/grocery-list"
import type { RepositoryInfra } from "./repository-infra"

export const RepositoryInfraInMemory = (): RepositoryInfra => ({
  account: new AccountRepository(new InMemoryRepository()),
  groceryList: new GroceryListRepository(
    new JsonPatchRepository({
      repo: new InMemoryRepository(),
      schema: std.pipe(groceryList.GroceryList, S.object.omit("lastUpdate")),
    }),
  ),
})
