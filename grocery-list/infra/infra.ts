import type { GroceryListRepository } from "grocery-list/domain/grocery-list/repository/grocery-list-repo"
import { Context } from "library/std/context"

export type Infra = {
  repository: {
    groceryList: GroceryListRepository
  }
}

export const [provideInfra, getInfra] = Context<Infra>("grocery-infra")
