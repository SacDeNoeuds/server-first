import { withAuthWall } from "@domain/authentication/interface/ui"
import { Participant } from "@domain/grocery-list/domain"
import { useCase } from "@domain/grocery-list/use-case"
import { GroceryListsPage } from "../components/grocery-lists-page"

export const getGroceryListsPage = withAuthWall(async (ctx) => {
  const id = Participant(ctx.account.id)
  const groceryLists = await useCase.listParticipantGroceryLists(id)
  return <GroceryListsPage groceryLists={groceryLists} />
})
