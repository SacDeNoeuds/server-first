import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withGroceryList } from "./grocery-list-:id"

export const editGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    previousName: string(),
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
    editedVersion: DateFromString,
  })
  try {
    const { editedVersion, name, previousName, ...body } = create(
      ctx.body,
      Payload,
    )
    const { [previousName]: _, ...nextItems } = ctx.groceryList.items
    nextItems[name] = body

    const { repository } = getInfra()
    const { lastUpdate, ...nextGroceryList } = ctx.groceryList
    nextGroceryList.items = nextItems
    await repository.groceryList.set(
      ctx.account.email,
      editedVersion,
      nextGroceryList,
    )

    const url = new URL(ctx.getHeader("referer") ?? "/", ctx.url)
    url.searchParams.set("jack", "o-lantern")
    return redirectTo(url)
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
