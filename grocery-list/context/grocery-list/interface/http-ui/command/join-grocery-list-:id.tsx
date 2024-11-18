import { tagged } from "@/std"
import { BadRequest } from "@/std/web/http-error"
import { redirectTo, type ServerHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import { Participant, type GroceryList } from "@domain/grocery-list/domain"
import type { JoinGroceryListCommand } from "@domain/grocery-list/domain/command/join-grocery-list"
import type { JSX } from "jsx-server/jsx-runtime"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>
export const JoinGroceryListHttpUiHandler =
  (command: { joinGroceryList: JoinGroceryListCommand }): Handler =>
  async (ctx) => {
    const { id } = ctx.params
    if (!id) return BadRequest({ message: "please provide an id" })
    const result = await command.joinGroceryList({
      author: ctx.account.id,
      participant: Participant.from(ctx.account.id),
      editedVersion: new Date(),
      groceryList: ctx.groceryList,
    })

    return tagged.matchAll(result, {
      GroceryList: () => redirectTo(new URL(`/grocery-list/${id}`, ctx.url)),
    })
  }
