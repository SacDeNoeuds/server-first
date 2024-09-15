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
    editedVersion: DateFromString,
  })
  try {
    const { editedVersion, name, ...body } = create(ctx.body, Payload)

    const { repository } = getInfra()
    const { lastUpdate, ...nextGroceryList } = ctx.groceryList
    nextGroceryList.items = { ...ctx.groceryList.items, [name]: body }
    await repository.groceryList.set(
      ctx.account.email,
      editedVersion,
      nextGroceryList,
    )

    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
