import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const addGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
  })
  try {
    const body = create(ctx.body, Payload)

    const { repository } = getInfra()
    await repository.groceryList.set({
      ...ctx.groceryList,
      items: [...ctx.groceryList.items, body],
    })
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
