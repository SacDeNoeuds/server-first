import { std } from "@/std"
import { schema as S } from "@/std/schema"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import { useCase } from "@domain/grocery-list/domain"
import {
  ItemName,
  ItemQuantity,
} from "@domain/grocery-list/domain/grocery-list"
import { withGroceryList } from "../middleware/with-grocery-list"

export const editGroceryListItem = withGroceryList(async (ctx) => {
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
    account: ctx.account,
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
})
