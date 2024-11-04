import type {
  GroceryList,
  GroceryListId,
  GroceryListRepository,
} from "../domain"

export type FindGroceryList = (
  id: GroceryListId,
) => Promise<GroceryList | undefined>

export const FindGroceryList = (repository: {
  groceryList: GroceryListRepository
}): FindGroceryList => repository.groceryList.find
