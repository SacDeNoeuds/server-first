import {
  GroceryList,
  GroceryListBehavior,
  ItemName,
  ItemQuantity,
  type GroceryListRepository,
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
    const nextGroceryList = GroceryListBehavior.addItem({
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
