import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import { authentication } from "@grocery-list/context/authentication"
import { useCase } from "@grocery-list/context/grocery-list/domain"
import { GroceryListNotFound } from "@grocery-list/context/grocery-list/domain/grocery-list"
import type { GroceryListId } from "@grocery-list/context/grocery-list/domain/grocery-list/grocery-list"
import { Html } from "@grocery-list/shared/ui/kit/html"

export const joinGroceryList = authentication.ui.withAuthWall(async (ctx) => {
  const id = ctx.params.id as GroceryListId | undefined
  if (!id) return BadRequest({ message: "please provide an id" })
  const result = await useCase.joinGroceryList({
    account: ctx.account,
    editedVersion: new Date(),
    groceryListId: id,
  })

  if (result instanceof GroceryListNotFound) {
    ctx.setStatus(404)
    return (
      <Html>
        <h2>This grocery list does not exist</h2>
        <p>Try asking your partner/flatmate to send you the link once again?</p>
      </Html>
    )
  }

  return redirectTo(new URL(`/grocery-list/${id}`, ctx.url))
})
