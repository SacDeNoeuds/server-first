import type { authentication } from "@grocery-list/context/authentication"
import { GroceryList, type GroceryListRepository } from "../grocery-list"

export type CreateGroceryList = (input: {
  account: authentication.Account
  name: string
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const CreateGroceryList =
  (repository: { groceryList: GroceryListRepository }): CreateGroceryList =>
  async (input) => {
    const groceryList = GroceryList.create({
      name: input.name,
      participant: input.account.id,
    })
    await repository.groceryList.set(
      input.account.email,
      new Date(),
      groceryList,
    )
    return groceryList
  }
