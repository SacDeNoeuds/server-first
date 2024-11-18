import type { ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { Participant } from "@domain/grocery-list/domain"
import type { ListParticipantGroceryLists } from "@domain/grocery-list/domain/query/list-participant-grocery-lists"
import type { JSX } from "jsx-server/jsx-runtime"
import { GroceryListsPage } from "../components/grocery-lists-page"

type Handler = ServerHandler<JSX.Element, { account: authentication.Account }>

export const GetGroceryListsPageHandler =
  (query: {
    listParticipantGroceryLists: ListParticipantGroceryLists
  }): Handler =>
  async (ctx) => {
    const id = Participant.from(ctx.account.id)
    const groceryLists = await query.listParticipantGroceryLists(id)
    return <GroceryListsPage groceryLists={groceryLists} />
  }
