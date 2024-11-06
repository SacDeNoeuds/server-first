import type { ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { Participant } from "@domain/grocery-list/domain"
import type { ListParticipantGroceryLists } from "@domain/grocery-list/use-case/list-participant-grocery-lists"
import type { JSX } from "jsx-server/jsx-runtime"
import { GroceryListsPage } from "../components/grocery-lists-page"

type Handler = ServerHandler<JSX.Element, { account: authentication.Account }>

export const GetGroceryListsPageHandler =
  (useCase: {
    listParticipantGroceryLists: ListParticipantGroceryLists
  }): Handler =>
  async (ctx) => {
    const id = Participant(ctx.account.id)
    const groceryLists = await useCase.listParticipantGroceryLists(id)
    return <GroceryListsPage groceryLists={groceryLists} />
  }
