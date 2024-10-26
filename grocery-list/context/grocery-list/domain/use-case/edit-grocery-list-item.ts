import type { authentication } from "@grocery-list/context/authentication"
import { GroceryList, type GroceryListRepository } from "../grocery-list"

export type EditGroceryListItem = (input: {
  account: authentication.Account
  groceryList: GroceryList
  editedVersion: Date
  previousName: string
  item: {
    name: string
    quantity: number
  }
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const EditGroceryListItem =
  (repository: { groceryList: GroceryListRepository }): EditGroceryListItem =>
  async (input) => {
    const nextGroceryList = GroceryList.editItem({
      groceryList: input.groceryList,
      previousName: input.previousName,
      item: input.item,
    })
    await repository.groceryList.set(
      input.account.email,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
