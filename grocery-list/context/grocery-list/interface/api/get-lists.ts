import { Forbidden } from "@/std/web/http-error"
import { JsonHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import { useCase } from "@domain/grocery-list/domain"
import { Participant } from "@domain/grocery-list/domain/grocery-list/grocery-list"

export const getGroceryLists = authentication.api.withAuth({
  error: () => Forbidden({ message: "we don’t know you" }),
  handler: JsonHandler(async (ctx) => {
    const id = Participant(ctx.account.id)
    const groceryLists = await useCase.listParticipantGroceryLists(id)
    return { groceryLists }
  }),
})
