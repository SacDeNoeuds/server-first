import type { GroceryList, GroceryListRepository } from "../domain"

export type RemoveGroceryList = (id: GroceryList["id"]) => Promise<void>

export const RemoveGroceryList = (repository: {
  groceryList: GroceryListRepository
}): RemoveGroceryList => repository.groceryList.remove
