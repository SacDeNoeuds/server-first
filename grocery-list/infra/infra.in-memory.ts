import { InMemoryRepository } from "@/std/repository-in-memory"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

export const InfraInMemory = (): Infra => ({
  repository: {
    groceryList: new GroceryListRepository(
      new InMemoryRepository({ mapId: (list) => list.id }),
    ),
  },
})
