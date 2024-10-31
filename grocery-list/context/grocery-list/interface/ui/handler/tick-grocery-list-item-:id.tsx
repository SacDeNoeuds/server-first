import { schema as S } from "@/std/schema"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import { useCase } from "@domain/grocery-list/domain"
import { ItemName } from "@domain/grocery-list/domain/grocery-list"
import { withGroceryList } from "../middleware/with-grocery-list"

export const tickGroceryListItem = withGroceryList(async (ctx) => {
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

  await useCase.tickGroceryListItem({
    account: ctx.account,
    editedVersion: body.value.editedVersion,
    groceryList: ctx.groceryList,
    itemName: body.value.name,
  })
  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
})
