import type { GroceryList, GroceryListRepository } from "../grocery-list"

export type RemoveGroceryList = (id: GroceryList["id"]) => Promise<void>

export const RemoveGroceryList = (repository: {
  groceryList: GroceryListRepository
}): RemoveGroceryList => repository.groceryList.remove
