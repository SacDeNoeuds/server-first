import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { create, object, string } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const tickGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: string(),
    at: DateFromString,
  })
  try {
    const { at, ...body } = create(ctx.body, Payload)
    const { [body.name]: suggestionToAdd, ...nextItems } = ctx.groceryList.items
    console.info({ suggestionToAdd: { ...suggestionToAdd, name: body.name } })

    const { repository } = getInfra()
    const nextGroceryList = { ...ctx.groceryList, items: nextItems }
    await repository.groceryList.set(ctx.account.email, at, nextGroceryList)
    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    return BadRequest({ message: "failed to decode body", cause })
  }
})
