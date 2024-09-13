import { Context } from "@/std/context"
import type { AccountRepository } from "../domain/authentication/repository/account-repo"
import type { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"

export type Infra = {
  repository: {
    account: AccountRepository
    groceryList: GroceryListRepository
  }
}

export const [provideInfra, getInfra] = Context<Infra>("grocery-infra")
