import { BadRequest } from "@/std/web/http-error"
import type { Handler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { withAuthWall } from "@domain/authentication/interface/ui"
import { Participant, type GroceryListId } from "@domain/grocery-list/domain"
import type { GroceryList } from "@domain/grocery-list/domain/grocery-list"
import { useCase } from "@domain/grocery-list/use-case"
import type { JSX } from "jsx-server/jsx-runtime"
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
    const participant = Participant(ctx.account.id)
    if (!groceryList || !groceryList.participants.has(participant)) {
      ctx.setStatus(404)
      return <NotFoundPage message={`grocery list "${id}" does not exist 🧐`} />
    }
    return handler({ ...ctx, groceryList })
  })
