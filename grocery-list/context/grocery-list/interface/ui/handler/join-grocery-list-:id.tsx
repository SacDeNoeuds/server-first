import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import type { GroceryList, GroceryListId } from "@domain/grocery-list/domain"
import { GroceryListNotFound, Participant } from "@domain/grocery-list/domain"
import type { JoinGroceryList } from "@domain/grocery-list/use-case/join-grocery-list"
import { Html } from "@shared/ui/kit/html"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>
export const JoinGroceryListHandler =
  (useCase: { joinGroceryList: JoinGroceryList }): Handler =>
  async (ctx) => {
    const id = ctx.params.id as GroceryListId | undefined
    if (!id) return BadRequest({ message: "please provide an id" })
    const result = await useCase.joinGroceryList({
      author: ctx.account.email,
      participant: Participant(ctx.account.id),
      editedVersion: new Date(),
      groceryListId: id,
    })

    if (result instanceof GroceryListNotFound) {
      ctx.setStatus(404)
      return (
        <Html>
          <h2>This grocery list does not exist</h2>
          <p>
            Try asking your partner/flatmate to send you the link once again?
          </p>
        </Html>
      )
    }

    return redirectTo(new URL(`/grocery-list/${id}`, ctx.url))
  }
