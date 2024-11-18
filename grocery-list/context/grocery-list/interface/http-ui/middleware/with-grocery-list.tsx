import { BadRequest } from "@/std/web/http-error"
import type { ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import type { GroceryList } from "@domain/grocery-list/domain"
import { Participant, type GroceryListId } from "@domain/grocery-list/domain"
import type { FindGroceryListById } from "@domain/grocery-list/domain/query/find-grocery-list-by-id"
import type { JSX } from "jsx-server/jsx-runtime"
import { NotFoundPage } from "../components/not-found-page"

export type WithGroceryList = ReturnType<typeof WithGroceryList>

export const WithGroceryList =
  (query: { findGroceryListById: FindGroceryListById }) =>
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

      const participant = Participant.from(ctx.account.id)
      const groceryList = await query.findGroceryListById(id, participant)
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
