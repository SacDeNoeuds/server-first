import type { authentication } from "@grocery-list/context/authentication"
import {
  GroceryList,
  GroceryListApi,
  type GroceryListItem,
} from "../grocery-list/grocery-list"
import type { GroceryListRepository } from "../grocery-list/grocery-list-repo"

export type AddGroceryListItem = (input: {
  account: authentication.Account
  groceryList: GroceryList
  item: GroceryListItem
  editedVersion: Date
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const AddGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): AddGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListApi.addItem({
      groceryList: input.groceryList,
      item: input.item,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
