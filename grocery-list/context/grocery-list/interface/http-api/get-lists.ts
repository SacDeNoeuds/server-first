import { JsonHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import { Participant } from "@domain/grocery-list/domain"
import type { ListParticipantGroceryLists } from "@domain/grocery-list/domain/query/list-participant-grocery-lists"

export const GetGroceryListsHandler = (useCase: {
  listParticipantGroceryLists: ListParticipantGroceryLists
}) =>
  JsonHandler<{ account: authentication.Account }>(async (ctx) => {
    const id = Participant.from(ctx.account.id)
    const groceryLists = await useCase.listParticipantGroceryLists(id)
    return { groceryLists }
  })
