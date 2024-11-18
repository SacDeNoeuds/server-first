import { schema as S, std, tagged } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import {
  GroceryList,
  ItemName,
  ItemQuantity,
} from "@domain/grocery-list/domain"
import type { AddGroceryListItemCommand } from "@domain/grocery-list/domain/command/add-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>

export const AddGroceryListItemHttpUiHandler =
  (command: { addGroceryListItem: AddGroceryListItemCommand }): Handler =>
  async (ctx) => {
    const schema = S.object({
      itemName: ItemName.schema,
      itemQuantity: std.pipe(
        S.numberFromString,
        S.compose(ItemQuantity.schema),
      ),
      editedVersion: S.date,
    })
    const data = schema.decode(ctx.body)
    if (S.isFailure(data)) {
      console.info(ctx.body)
      console.error(data)
      return BadRequest({ message: "failed to decode body", cause: data })
    }

    const parsed = data.value
    const result = await command.addGroceryListItem({
      author: ctx.account.id,
      groceryList: ctx.groceryList,
      editedVersion: parsed.editedVersion,
      itemName: parsed.itemName,
      itemQuantity: parsed.itemQuantity,
    })

    return tagged.matchAll(result, {
      GroceryList: () => {
        return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
      },
    })
  }
