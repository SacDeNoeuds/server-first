import type { CommandHandler } from "@/std"
import type { AccountId } from "@shared/value-object/account-id"
import { createList as createGroceryList } from "../aggregate"
import type { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import { ListName } from "../value-object/list-name"
import { Participant } from "../value-object/participant"

type Input = {
  author: AccountId
  participant: Participant
  name: ListName
}

export type CreateGroceryListCommand = CommandHandler<Input, never, GroceryList>

export const CreateGroceryListCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): CreateGroceryListCommand =>
  async (input) => {
    const groceryList = createGroceryList({
      name: input.name,
      participant: input.participant,
    })
    await repository.groceryList.set(input.author, new Date(), groceryList)
    return groceryList
  }
