import type { GroceryList, GroceryListRepository, Participant } from "../domain"

export type ListParticipantGroceryLists = (
  participant: Participant,
) => Promise<GroceryList[]>

export const ListParticipantGroceryLists = (repository: {
  groceryList: GroceryListRepository
}): ListParticipantGroceryLists => repository.groceryList.listByParticipant
