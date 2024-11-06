import { schema as S, std } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import {
  GroceryList,
  ItemName,
  ItemQuantity,
} from "@domain/grocery-list/domain"
import type { EditGroceryListItem } from "@domain/grocery-list/use-case/edit-grocery-list-item"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>
export const EditGroceryListItemHandler =
  (useCase: { editGroceryListItem: EditGroceryListItem }): Handler =>
  async (ctx) => {
    const Payload = S.object({
      previousName: ItemName,
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

    await useCase.editGroceryListItem({
      author: ctx.account.email,
      editedVersion: body.value.editedVersion,
      groceryList: ctx.groceryList,
      previousName: body.value.previousName,
      item: {
        name: body.value.name,
        quantity: body.value.quantity,
      },
    })

    const url = new URL(ctx.getHeader("referer") ?? "/", ctx.url)
    return redirectTo(url)
  }
