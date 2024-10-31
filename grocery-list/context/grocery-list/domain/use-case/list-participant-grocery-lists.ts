import type { GroceryList, GroceryListRepository } from "../grocery-list"
import type { Participant } from "../grocery-list/grocery-list"

export type ListParticipantGroceryLists = (
  participant: Participant,
) => Promise<GroceryList[]>

export const ListParticipantGroceryLists = (repository: {
  groceryList: GroceryListRepository
}): ListParticipantGroceryLists => repository.groceryList.listByParticipant
