import type { authentication } from "@domain/authentication"
import {
  GroceryList,
  GroceryListApi,
  ItemName,
  ItemQuantity,
  type GroceryListRepository,
} from "../grocery-list"

export type AddGroceryListItem = (input: {
  account: authentication.Account
  groceryList: GroceryList
  itemName: ItemName
  itemQuantity: ItemQuantity
  editedVersion: Date
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const AddGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): AddGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListApi.addItem({
      groceryList: input.groceryList,
      name: input.itemName,
      quantity: input.itemQuantity,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
