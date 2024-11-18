import type { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import type { GroceryListId } from "../value-object/grocery-list-id"
import type { Participant } from "../value-object/participant"

export type FindGroceryListById = (
  id: GroceryListId,
  participant: Participant,
) => Promise<{ value: GroceryList; lastUpdate: Date } | undefined>

export const FindGroceryListById =
  (repository: { groceryList: GroceryListRepository }): FindGroceryListById =>
  async (id, participant) => {
    const list = await repository.groceryList.find(id)
    return list?.value.participants.has(participant) ? list : undefined
  }
