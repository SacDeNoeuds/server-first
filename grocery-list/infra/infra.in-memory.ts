import { GroceryListRepository } from "grocery-list/domain/grocery-list/repository/grocery-list-repo"
import { InMemoryRepository } from "library/std/repository-in-memory"
import type { Infra } from "./infra"

export const InfraInMemory = (): Infra => ({
  repository: {
    groceryList: new GroceryListRepository(
      new InMemoryRepository({
        mapId: (list) => list.id,
      }),
    ),
  },
})
