import { schema as S, std } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import {
  ItemName,
  ItemQuantity,
  type GroceryList,
} from "@domain/grocery-list/domain"
import type { AddGroceryListItem } from "@domain/grocery-list/use-case/add-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>

export const AddGroceryListItemHandler =
  (useCase: { addGroceryListItem: AddGroceryListItem }): Handler =>
  async (ctx) => {
    const Payload = S.object({
      name: ItemName,
      quantity: std.pipe(S.numberFromString, S.compose(ItemQuantity)),
      editedVersion: S.date,
    })
    const body = Payload.decode(ctx.body)
    if (S.isFailure(body)) {
      console.info(ctx.body)
      console.error(body)
      return BadRequest({ message: "failed to decode body", cause: body })
    }

    await useCase.addGroceryListItem({
      author: ctx.account.email,
      editedVersion: body.value.editedVersion,
      groceryList: ctx.groceryList,
      itemName: body.value.name,
      itemQuantity: body.value.quantity,
    })

    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  }
