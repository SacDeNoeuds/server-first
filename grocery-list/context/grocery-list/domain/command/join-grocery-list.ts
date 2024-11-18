import type { CommandHandler } from "@/std"
import type { AccountId } from "@shared/value-object/account-id"
import { addParticipant } from "../aggregate"
import { GroceryList } from "../grocery-list"
import type { GroceryListRepository } from "../persistence/grocery-list-repo"
import { Participant } from "../value-object/participant"

type Input = {
  author: AccountId
  participant: Participant
  groceryList: GroceryList
  editedVersion: Date
}
export type JoinGroceryListCommand = CommandHandler<Input, never, GroceryList>

export const JoinGroceryListCommand =
  (repository: {
    groceryList: GroceryListRepository
  }): JoinGroceryListCommand =>
  async (input) => {
    const nextGroceryList = addParticipant({
      groceryList: input.groceryList,
      participant: input.participant,
    })
    await repository.groceryList.set(
      input.author,
      input.editedVersion,
      nextGroceryList,
    )
    return nextGroceryList
  }
