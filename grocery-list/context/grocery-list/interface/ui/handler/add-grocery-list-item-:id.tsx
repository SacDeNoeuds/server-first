import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { DateFromString } from "@/superstruct"
import { coerce, create, number, object, string, trimmed } from "superstruct"
import { useCase } from "../../../domain"
import { withGroceryList } from "../middleware/with-grocery-list"

export const addGroceryListItem = withGroceryList(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
    quantity: coerce(number(), string(), Number),
    editedVersion: DateFromString,
  })
  try {
    const body = create(ctx.body, Payload)

    await useCase.addGroceryListItem({
      account: ctx.account,
      editedVersion: body.editedVersion,
      groceryList: ctx.groceryList,
      item: {
        name: body.name,
        quantity: body.quantity,
      },
    })

    return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
  } catch (cause) {
    console.info(ctx.body)
    console.error(cause)
    return BadRequest({ message: "failed to decode body", cause })
  }
})
