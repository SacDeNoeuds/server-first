import type { AccountRepository } from "@domain/authentication/domain/account"
import type { GroceryListRepository } from "../context/grocery-list/domain/grocery-list/grocery-list-repo"

export type RepositoryInfra = {
  account: AccountRepository
  groceryList: GroceryListRepository
}
