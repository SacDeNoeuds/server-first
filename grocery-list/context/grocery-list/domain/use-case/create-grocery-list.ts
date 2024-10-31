import type { authentication } from "@domain/authentication"
import {
  GroceryList,
  GroceryListApi,
  ListName,
  type GroceryListRepository,
} from "../grocery-list"
import { Participant } from "../grocery-list/grocery-list"

export type CreateGroceryList = (input: {
  account: authentication.Account
  name: ListName
}) => Promise<Omit<GroceryList, "lastUpdate">>

export const CreateGroceryList =
  (repository: { groceryList: GroceryListRepository }): CreateGroceryList =>
  async (input) => {
    const groceryList = GroceryListApi.create({
      name: input.name,
      participant: Participant(input.account.id),
    })
    await repository.groceryList.set(
      input.account.email,
      new Date(),
      groceryList,
    )
    return groceryList
  }
