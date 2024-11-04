import { schema as S, std } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import {
  ItemName,
  ItemQuantity,
} from "@domain/grocery-list/domain/grocery-list"
import { useCase } from "../../../use-case"
import { withGroceryList } from "../middleware/with-grocery-list"

export const addGroceryListItem = withGroceryList(async (ctx) => {
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

  console.info("body", body.value)

  await useCase.addGroceryListItem({
    author: ctx.account.email,
    editedVersion: body.value.editedVersion,
    groceryList: ctx.groceryList,
    itemName: body.value.name,
    itemQuantity: body.value.quantity,
  })

  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
})
