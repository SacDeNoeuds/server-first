import type { authentication } from "@grocery-list/context/authentication"
import {
  GroceryList,
  GroceryListApi,
  GroceryListNotFound,
  type GroceryListRepository,
} from "../grocery-list"
import type { GroceryListId } from "../grocery-list/grocery-list"

export type JoinGroceryList = (input: {
  groceryListId: GroceryListId
  account: authentication.Account
  editedVersion: Date
}) => Promise<GroceryList | GroceryListNotFound>

export const JoinGroceryList =
  (repository: { groceryList: GroceryListRepository }): JoinGroceryList =>
  async (input) => {
    const groceryList = await repository.groceryList.find(input.groceryListId)
    if (!groceryList) return new GroceryListNotFound(input.groceryListId)
    const nextGroceryList = GroceryListApi.join({
      groceryList,
      participant: input.account.id,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
