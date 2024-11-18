import { schema as S, std, tagged } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import {
  ItemName,
  ItemQuantity,
  type GroceryList,
} from "@domain/grocery-list/domain"
import type { EditGroceryListItemCommand } from "@domain/grocery-list/domain/command/edit-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>
export const EditGroceryListItemHttpUiHandler =
  (command: { editGroceryListItem: EditGroceryListItemCommand }): Handler =>
  async (ctx) => {
    const schema = S.object({
      previousName: ItemName.schema,
      name: ItemName.schema,
      quantity: std.pipe(S.numberFromString, S.compose(ItemQuantity.schema)),
      editedVersion: S.date,
    })

    const data = schema.decode(ctx.body)
    if (S.isFailure(data)) {
      console.info(ctx.body)
      console.error(data)
      return BadRequest({ message: "failed to decode body", cause: data })
    }

    const parsed = data.value
    const result = await command.editGroceryListItem({
      author: ctx.account.id,
      editedVersion: parsed.editedVersion,
      groceryList: ctx.groceryList,
      previousItemName: parsed.previousName,
      itemName: parsed.name,
      itemQuantity: parsed.quantity,
    })

    return tagged.matchAll(result, {
      GroceryList: () => {
        const url = new URL(ctx.getHeader("referer") ?? "/", ctx.url)
        return redirectTo(url)
      },
    })
  }
