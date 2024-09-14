import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const addGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
    at: DateFromString,
  })
  try {
    const { at, name, ...body } = create(ctx.body, Payload)

    const { repository } = getInfra()
    const nextValue = {
      ...ctx.groceryList,
      items: { ...ctx.groceryList.items, [name]: body },
    }
    await repository.groceryList.set(ctx.account.email, at, nextValue)
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
