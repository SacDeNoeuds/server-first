import { schema as S, type CommandHandler } from "@/std"
import {
  GroceryListId,
  GroceryListNotFound,
  ItemName,
  ItemQuantity,
  Participant,
} from "@domain/grocery-list/domain"
import type { EditGroceryListItemCommand } from "@domain/grocery-list/domain/command/edit-grocery-list-item"
import {
  GroceryListJson,
  type GroceryListJsonTransferObject,
} from "@domain/grocery-list/domain/data-transfer-object"
import type { FindGroceryListById } from "@domain/grocery-list/domain/query/find-grocery-list-by-id"
import type { AccountId } from "@shared/value-object/account-id"

type Input = {
  accountId: AccountId
  timestamp: Date
  groceryListId: string
  itemName: string
  itemQuantity: number
  previousItemName: string
}
type EditGroceryListItemApiHandler = CommandHandler<
  Input,
  S.Failure | GroceryListNotFound,
  GroceryListJsonTransferObject
>
export const EditGroceryListItemApiHandler =
  (deps: {
    findGroceryListById: FindGroceryListById
    editGroceryListItem: EditGroceryListItemCommand
  }): EditGroceryListItemApiHandler =>
  async (input) => {
    const schema = S.object({
      groceryListId: GroceryListId.schema,
      previousItemName: ItemName.schema,
      itemName: ItemName.schema,
      itemQuantity: ItemQuantity.schema,
    } satisfies { [Key in keyof Input]?: unknown })

    const data = schema.decode(input)
    if (S.isFailure(data)) return data

    const parsed = data.value
    const participant = Participant.from(input.accountId)
    const groceryList = await deps.findGroceryListById(
      parsed.groceryListId,
      participant,
    )
    if (!groceryList)
      return new GroceryListNotFound({ id: parsed.groceryListId })

    const updatedGroceryList = await deps.editGroceryListItem({
      author: input.accountId,
      editedVersion: input.timestamp,
      groceryList: groceryList.value,
      previousItemName: parsed.previousItemName,
      itemName: parsed.itemName,
      itemQuantity: parsed.itemQuantity,
    })
    return GroceryListJson.toJson(updatedGroceryList)
  }
