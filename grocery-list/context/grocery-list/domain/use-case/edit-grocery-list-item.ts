import type { authentication } from "@domain/authentication"
import {
  GroceryList,
  GroceryListApi,
  ItemName,
  ItemQuantity,
  type GroceryListRepository,
} from "../grocery-list"

export type EditGroceryListItem = (input: {
  account: authentication.Account
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
    const nextGroceryList = GroceryListApi.editItem({
      groceryList: input.groceryList,
      previousName: input.previousName,
      name: input.item.name,
      quantity: input.item.quantity,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
