import { BadRequest } from "@/std/web/http-error"
import type { ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import type { GroceryList } from "@domain/grocery-list/domain"
import { Participant, type GroceryListId } from "@domain/grocery-list/domain"
import type { FindGroceryList } from "@domain/grocery-list/use-case/find-grocery-list"
import type { JSX } from "jsx-server/jsx-runtime"
import { NotFoundPage } from "../components/not-found-page"

export type WithGroceryList = ReturnType<typeof WithGroceryList>

export const WithGroceryList =
  (deps: { findGroceryList: FindGroceryList }) =>
  (
    handler: ServerHandler<
      JSX.Element,
      {
        account: authentication.Account
        groceryList: GroceryList
        lastGroceryListUpdate: Date
      }
    >,
  ): ServerHandler<JSX.Element, { account: authentication.Account }> => {
    return async (ctx) => {
      const id = ctx.params.id as GroceryListId | undefined
      if (!id) return BadRequest({ message: "please provide an id" })

      const participant = Participant(ctx.account.id)
      const groceryList = await deps.findGroceryList(id, participant)
      if (!groceryList) {
        ctx.setStatus(404)
        return (
          <NotFoundPage message={`grocery list "${id}" does not exist 🧐`} />
        )
      }
      return handler({
        ...ctx,
        groceryList: groceryList.value,
        lastGroceryListUpdate: groceryList.lastUpdate,
      })
    }
  }
