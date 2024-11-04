import {
  GroceryList,
  GroceryListBehavior,
  GroceryListNotFound,
  Participant,
  type GroceryListId,
  type GroceryListRepository,
} from "../domain"

export type JoinGroceryList = (input: {
  author: string
  participant: Participant
  groceryListId: GroceryListId
  editedVersion: Date
}) => Promise<GroceryList | GroceryListNotFound>

export const JoinGroceryList =
  (repository: { groceryList: GroceryListRepository }): JoinGroceryList =>
  async (input) => {
    const groceryList = await repository.groceryList.find(input.groceryListId)
    if (!groceryList) return new GroceryListNotFound(input.groceryListId)
    const nextGroceryList = GroceryListBehavior.join({
      groceryList,
      participant: Participant(input.participant),
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
