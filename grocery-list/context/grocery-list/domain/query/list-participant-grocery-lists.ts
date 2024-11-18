import type { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import type { Participant } from "../value-object/participant"

export type ListParticipantGroceryLists = (
  participant: Participant,
) => Promise<{ value: GroceryList; lastUpdate: Date }[]>

export const ListParticipantGroceryLists = (repository: {
  groceryList: GroceryListRepository
}): ListParticipantGroceryLists => repository.groceryList.listByParticipant
