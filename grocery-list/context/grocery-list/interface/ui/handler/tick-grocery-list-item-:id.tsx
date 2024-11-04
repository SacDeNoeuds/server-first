import { schema as S } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import { ItemName } from "@domain/grocery-list/domain"
import { useCase } from "@domain/grocery-list/use-case"
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
    author: ctx.account.email,
    editedVersion: body.value.editedVersion,
    groceryList: ctx.groceryList,
    itemName: body.value.name,
  })
  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
})
