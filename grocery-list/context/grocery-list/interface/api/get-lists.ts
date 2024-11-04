import { Forbidden } from "@/std/web/http-error"
import { JsonHandler } from "@/std/web/server-handler"
import { authentication } from "@domain/authentication"
import { Participant } from "@domain/grocery-list/domain"
import { useCase } from "@domain/grocery-list/use-case"

export const getGroceryLists = authentication.api.withAuth({
  error: () => Forbidden({ message: "we don’t know you" }),
  handler: JsonHandler(async (ctx) => {
    const id = Participant(ctx.account.id)
    const groceryLists = await useCase.listParticipantGroceryLists(id)
    return { groceryLists }
  }),
})
