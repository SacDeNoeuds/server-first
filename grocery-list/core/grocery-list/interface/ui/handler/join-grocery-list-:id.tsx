import { BadRequest } from "@/std/web/http-error"
import { redirectTo } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import type { GroceryListId } from "@domain/grocery-list/domain"
import { GroceryListNotFound } from "@domain/grocery-list/domain"
import { useCase } from "@domain/grocery-list/use-case"
import { Html } from "@shared/ui/kit/html"

export const joinGroceryList = authentication.ui.withAuthWall(async (ctx) => {
  const id = ctx.params.id as GroceryListId | undefined
  if (!id) return BadRequest({ message: "please provide an id" })
  const result = await useCase.joinGroceryList({
    author: ctx.account.email,
    participant: ctx.account.id,
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
