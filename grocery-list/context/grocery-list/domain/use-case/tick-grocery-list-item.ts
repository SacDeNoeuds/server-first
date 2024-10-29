import type { authentication } from "@grocery-list/context/authentication"
import {
  GroceryList,
  GroceryListApi,
  ItemName,
  type GroceryListRepository,
} from "../grocery-list"

export type TickGroceryListItem = (input: {
  account: authentication.Account
  groceryList: GroceryList
  editedVersion: Date
  itemName: ItemName
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const TickGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): TickGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryListApi.tickItem({
      groceryList: input.groceryList,
      itemName: input.itemName,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
