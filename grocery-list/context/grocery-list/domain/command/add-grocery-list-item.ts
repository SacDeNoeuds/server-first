import type { CommandHandler } from "@/std"
import type { AccountId } from "@shared/value-object/account-id"
import { addItem } from "../aggregate"
import { GroceryList } from "../grocery-list"
import { type GroceryListRepository } from "../persistence/grocery-list-repo"
import { ItemName } from "../value-object/item-name"
import { ItemQuantity } from "../value-object/item-quantity"

type Input = {
  author: AccountId
  groceryList: GroceryList
  itemName: ItemName
  itemQuantity: ItemQuantity
  editedVersion: Date
}

export type AddGroceryListItemCommand = CommandHandler<
  Input,
  never,
  GroceryList
>

export const AddGroceryListItemCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): AddGroceryListItemCommand =>
  async (input) => {
    const nextGroceryList = addItem({
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
