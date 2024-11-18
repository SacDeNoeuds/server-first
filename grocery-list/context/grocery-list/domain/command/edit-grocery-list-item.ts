import type { CommandHandler } from "@/std"
import type { AccountId } from "@shared/value-object/account-id"
import { editItem } from "../aggregate"
import type { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import { ItemName } from "../value-object/item-name"
import { ItemQuantity } from "../value-object/item-quantity"

type Input = {
  author: AccountId
  groceryList: GroceryList
  editedVersion: Date
  previousItemName: ItemName
  itemName: ItemName
  itemQuantity: ItemQuantity
}

export type EditGroceryListItemCommand = CommandHandler<
  Input,
  never,
  GroceryList
>

export const EditGroceryListItemCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): EditGroceryListItemCommand =>
  async (input) => {
    const nextGroceryList = editItem({
      groceryList: input.groceryList,
      previousName: input.previousItemName,
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
