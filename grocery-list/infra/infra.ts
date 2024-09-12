import { Context } from "@/std/context"
import type { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"

export type Infra = {
  repository: {
    groceryList: GroceryListRepository
  }
}

export const [provideInfra, getInfra] = Context<Infra>("grocery-infra")
