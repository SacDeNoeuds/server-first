import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { useCase } from "@grocery-list/context/grocery-list/domain"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { withGroceryList } from "../middleware/with-grocery-list"

export const editGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    previousName: string(),
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
    editedVersion: DateFromString,
  })
  try {
    const body = create(ctx.body, Payload)
    await useCase.editGroceryListItem({
      account: ctx.account,
      editedVersion: body.editedVersion,
      groceryList: ctx.groceryList,
      previousName: body.previousName,
      item: {
        name: body.name,
        quantity: body.quantity,
      },
    })

    const url = new URL(ctx.getHeader("referer") ?? "/", ctx.url)
    return redirectTo(url)
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
