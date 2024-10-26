import type { GroceryList, GroceryListRepository } from "../grocery-list"
import type { GroceryListId } from "../grocery-list/grocery-list"

export type FindGroceryList = (
  id: GroceryListId,
) => Promise<GroceryList | undefined>

export const FindGroceryList = (repository: {
  groceryList: GroceryListRepository
}): FindGroceryList => repository.groceryList.find
