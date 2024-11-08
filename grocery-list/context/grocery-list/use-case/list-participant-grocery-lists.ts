import type { GroceryList, GroceryListRepository, Participant } from "../domain"

export type ListParticipantGroceryLists = (
  participant: Participant,
) => Promise<{ value: GroceryList; lastUpdate: Date }[]>

export const ListParticipantGroceryLists = (repository: {
  groceryList: GroceryListRepository
}): ListParticipantGroceryLists => repository.groceryList.listByParticipant
