import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { create, object, string } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const tickGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: string(),
    editedVersion: DateFromString,
  })
  try {
    const { editedVersion, ...body } = create(ctx.body, Payload)
    const { [body.name]: suggestionToAdd, ...nextItems } = ctx.groceryList.items
    console.info({ suggestionToAdd: { ...suggestionToAdd, name: body.name } })

    const { repository } = getInfra()
    const { lastUpdate, ...nextGroceryList } = ctx.groceryList
    nextGroceryList.items = nextItems
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
