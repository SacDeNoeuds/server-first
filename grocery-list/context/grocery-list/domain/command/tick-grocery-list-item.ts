import type { CommandHandler } from "@/std"
import type { AccountId } from "@shared/value-object/account-id"
import { tickItem } from "../aggregate"
import type { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import { ItemName } from "../value-object/item-name"

type Input = {
  author: AccountId
  groceryList: GroceryList
  editedVersion: Date
  itemName: ItemName
}

export type TickGroceryListItemCommand = CommandHandler<
  Input,
  never,
  GroceryList
>

export const TickGroceryListItemCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): TickGroceryListItemCommand =>
  async (input) => {
    const nextGroceryList = tickItem({
      groceryList: input.groceryList,
      itemName: input.itemName,
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
