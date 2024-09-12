import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const editGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    index: coerce(number(), string(), Number),
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
  })
  try {
    const body = create(ctx.body, Payload)
    console.info("body", body)
    const nextItems = ctx.groceryList.items.map((item, index) => {
      if (index !== body.index) return item
      return { name: body.name, quantity: body.quantity }
    })

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
