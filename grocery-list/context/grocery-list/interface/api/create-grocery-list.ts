import { schema as S, type CommandHandler } from "@/std"
import { ListName, Participant } from "@domain/grocery-list/domain"
import type { CreateGroceryListCommand } from "@domain/grocery-list/domain/command/create-grocery-list"
import {
  GroceryListJson,
  type GroceryListJsonTransferObject,
} from "@domain/grocery-list/domain/data-transfer-object"
import type { AccountId } from "@shared/value-object/account-id"

type Input = {
  accountId: AccountId
  listName: string
}
type CreateGroceryListApiHandler = CommandHandler<
  Input,
  S.Failure,
  GroceryListJsonTransferObject
>
export const CreateGroceryListApiHandler =
  (command: {
    createGroceryList: CreateGroceryListCommand
  }): CreateGroceryListApiHandler =>
  async (input) => {
    const schema = S.object({ listName: ListName.schema })
    const data = schema.decode({ listName: input.listName })
    if (S.isFailure(data)) return data

    const parsed = data.value
    const groceryList = await command.createGroceryList({
      author: input.accountId,
      name: parsed.listName,
      participant: Participant.from(input.accountId),
    })
    return GroceryListJson.toJson(groceryList)
  }
