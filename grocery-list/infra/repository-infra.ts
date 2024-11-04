import type { AccountRepository } from "@domain/authentication/domain/account"
import type { GroceryListRepository } from "@domain/grocery-list/domain"

export type RepositoryInfra = {
  account: AccountRepository
  groceryList: GroceryListRepository
}
