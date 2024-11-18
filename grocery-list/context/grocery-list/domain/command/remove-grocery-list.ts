import type { CommandHandler } from "@/std"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import { GroceryListId } from "../value-object/grocery-list-id"

type Input = {
  id: GroceryListId
}
export type RemoveGroceryListCommand = CommandHandler<Input, never, void>

export const RemoveGroceryListCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): RemoveGroceryListCommand =>
  async (input) => {
    await repository.groceryList.remove(input.id)
  }
