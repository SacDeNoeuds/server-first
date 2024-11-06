import { schema as S } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { GroceryList, ItemName } from "@domain/grocery-list/domain"
import type { TickGroceryListItem } from "@domain/grocery-list/use-case/tick-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>

export const TickGroceryListItemHandler =
  (deps: { tickGroceryListItem: TickGroceryListItem }): Handler =>
  async (ctx) => {
    const Payload = S.object({
      name: ItemName,
      editedVersion: S.date,
    })
    const body = Payload.decode(ctx.body)
    if (S.isFailure(body)) {
      console.info(ctx.body)
      console.error(body)
      return BadRequest({ message: "failed to decode body", cause: body })
    }

    await deps.tickGroceryListItem({
      author: ctx.account.email,
      editedVersion: body.value.editedVersion,
      groceryList: ctx.groceryList,
      itemName: body.value.name,
    })
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  }
