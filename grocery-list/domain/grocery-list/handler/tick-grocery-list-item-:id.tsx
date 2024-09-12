import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { coerce, create, number, object, string } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const tickGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    index: coerce(number(), string(), Number),
  })
  try {
    const body = create(ctx.body, Payload)
    const nextItems = [...ctx.groceryList.items]
    const [suggestionToAdd] = nextItems.splice(body.index, 1)
    console.info({ suggestionToAdd })

    const { repository } = getInfra()
    await repository.groceryList.set({
      ...ctx.groceryList,
      items: nextItems,
    })
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    return BadRequest({ message: "failed to decode body", cause })
  }
})
