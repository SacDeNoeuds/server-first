import {
  GroceryList,
  GroceryListAggregate,
  type GroceryListRepository,
  type ItemName,
} from "../domain"

export type TickGroceryListItem = (input: {
  author: string
  groceryList: GroceryList
  editedVersion: Date
  itemName: ItemName
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const TickGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): TickGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListAggregate.tickItem({
      groceryList: input.groceryList,
      itemName: input.itemName,
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
