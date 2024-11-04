import type { AccountRepository } from "@domain/authentication/domain"
import type { GroceryListRepository } from "@domain/grocery-list/domain"

export type RepositoryInfra = {
  account: AccountRepository
  groceryList: GroceryListRepository
}
