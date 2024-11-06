import { JsonHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import { Participant } from "@domain/grocery-list/domain"
import type { ListParticipantGroceryLists } from "@domain/grocery-list/use-case/list-participant-grocery-lists"

export const GetGroceryListsHandler = (useCase: {
  listParticipantGroceryLists: ListParticipantGroceryLists
}) =>
  JsonHandler<{ account: authentication.Account }>(async (ctx) => {
    const id = Participant(ctx.account.id)
    const groceryLists = await useCase.listParticipantGroceryLists(id)
    return { groceryLists }
  })
// export const getGroceryLists = authentication.api.withAuth({
//   error: () => Forbidden({ message: "we don’t know you" }),
//   handler: JsonHandler(async (ctx) => {
//     const id = Participant(ctx.account.id)
//     const groceryLists = await useCase.listParticipantGroceryLists(id)
//     return { groceryLists }
//   }),
// })
