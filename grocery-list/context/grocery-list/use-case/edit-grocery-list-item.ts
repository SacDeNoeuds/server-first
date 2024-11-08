import {
  GroceryList,
  GroceryListAggregate,
  type GroceryListRepository,
  type ItemName,
  type ItemQuantity,
} from "../domain"

export type EditGroceryListItem = (input: {
  author: string
  groceryList: GroceryList
  editedVersion: Date
  previousName: ItemName
  item: {
    name: ItemName
    quantity: ItemQuantity
  }
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const EditGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): EditGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListAggregate.editItem({
      groceryList: input.groceryList,
      previousName: input.previousName,
      name: input.item.name,
      quantity: input.item.quantity,
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
