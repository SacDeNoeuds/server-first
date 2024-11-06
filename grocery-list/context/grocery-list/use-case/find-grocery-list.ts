import type {
  GroceryList,
  GroceryListId,
  GroceryListRepository,
  Participant,
} from "../domain"

export type FindGroceryList = (
  id: GroceryListId,
  participant: Participant,
) => Promise<GroceryList | undefined>

export const FindGroceryList =
  (repository: { groceryList: GroceryListRepository }): FindGroceryList =>
  async (id, participant) => {
    const list = await repository.groceryList.find(id)
    return list?.participants.has(participant) ? list : undefined
  }
