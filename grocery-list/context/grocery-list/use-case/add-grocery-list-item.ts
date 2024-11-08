import {
  GroceryList,
  GroceryListAggregate,
  type GroceryListRepository,
  type ItemName,
  type ItemQuantity,
} from "../domain"

export type AddGroceryListItem = (input: {
  author: string
  groceryList: GroceryList
  itemName: ItemName
  itemQuantity: ItemQuantity
  editedVersion: Date
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const AddGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): AddGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListAggregate.addItem({
      groceryList: input.groceryList,
      name: input.itemName,
      quantity: input.itemQuantity,
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
