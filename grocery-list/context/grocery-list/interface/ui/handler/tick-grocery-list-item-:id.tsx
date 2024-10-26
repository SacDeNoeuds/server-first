import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { useCase } from "@grocery-list/context/grocery-list/domain/use-case"
import { create, object, string } from "superstruct"
import { withGroceryList } from "../middleware/with-grocery-list"

export const tickGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: string(),
    editedVersion: DateFromString,
  })
  try {
    const body = create(ctx.body, Payload)
    await useCase.tickGroceryListItem({
      account: ctx.account,
      editedVersion: body.editedVersion,
      groceryList: ctx.groceryList,
      itemName: body.name,
    })
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
