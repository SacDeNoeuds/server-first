import { std } from "@/std"
import { schema as S } from "@/std/schema"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import {
  ItemName,
  ItemQuantity,
} from "@grocery-list/context/grocery-list/domain/grocery-list"
import { useCase } from "../../../domain"
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
    account: ctx.account,
    editedVersion: body.value.editedVersion,
    groceryList: ctx.groceryList,
    item: {
      name: body.value.name,
      quantity: body.value.quantity,
    },
  })

  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
})
