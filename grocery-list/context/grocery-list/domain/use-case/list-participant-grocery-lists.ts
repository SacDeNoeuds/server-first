import type { GroceryList, GroceryListRepository } from "../grocery-list"
import type { GroceryListParticipant } from "../grocery-list/grocery-list"

export type ListParticipantGroceryLists = (
  participant: GroceryListParticipant,
) => Promise<GroceryList[]>

export const ListParticipantGroceryLists = (repository: {
  groceryList: GroceryListRepository
}): ListParticipantGroceryLists => repository.groceryList.listByParticipant
