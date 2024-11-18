import { schema as S } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { ItemName, type GroceryList } from "@domain/grocery-list/domain"
import type { TickGroceryListItemCommand } from "@domain/grocery-list/domain/command/tick-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>

export const TickGroceryListItemHttpUiHandler =
  (command: { tickGroceryListItem: TickGroceryListItemCommand }): Handler =>
  async (ctx) => {
    const bodySchema = S.object({
      name: ItemName.schema,
      editedVersion: S.date,
    })
    const body = bodySchema.decode(ctx.body)
    if (S.isFailure(body)) {
      console.info(ctx.body)
      console.error(body)
      return BadRequest({ message: "failed to decode body", cause: body })
    }

    await command.tickGroceryListItem({
      author: ctx.account.id,
      groceryList: ctx.groceryList,
      editedVersion: body.value.editedVersion,
      itemName: body.value.name,
    })
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  }
