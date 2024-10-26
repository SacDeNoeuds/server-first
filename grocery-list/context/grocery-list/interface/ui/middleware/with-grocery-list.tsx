import { BadRequest } from "@/std/http-error"
import type { Handler } from "@/std/server-handler"
import type { authentication } from "@grocery-list/context/authentication"
import { withAuthWall } from "@grocery-list/context/authentication/interface/ui"
import type { GroceryList } from "@grocery-list/context/grocery-list/domain/grocery-list"
import type { GroceryListId } from "@grocery-list/context/grocery-list/domain/grocery-list/grocery-list"
import { useCase } from "@grocery-list/context/grocery-list/domain/use-case"
import { NotFoundPage } from "../components/not-found-page"

export const withGroceryList = (
  handler: Handler<
    JSX.Element,
    { account: authentication.Account; groceryList: GroceryList }
  >,
): Handler =>
  withAuthWall(async (ctx) => {
    const id = ctx.params.id as GroceryListId | undefined
    if (!id) return BadRequest({ message: "please provide an id" })

    const groceryList = await useCase.findGroceryList(id)
    if (!groceryList || !groceryList.participants.has(ctx.account.id)) {
      ctx.setStatus(404)
      return <NotFoundPage message={`grocery list "${id}" does not exist 🧐`} />
    }
    return handler({ ...ctx, groceryList })
  })