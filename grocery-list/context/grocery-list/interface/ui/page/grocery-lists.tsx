import { withAuthWall } from "@domain/authentication/interface/ui"
import { useCase } from "@domain/grocery-list/domain"
import { Participant } from "@domain/grocery-list/domain/grocery-list/grocery-list"
import { GroceryListsPage } from "../components/grocery-lists-page"

export const getGroceryListsPage = withAuthWall(async (ctx) => {
  const id = Participant(ctx.account.id)
  const groceryLists = await useCase.listParticipantGroceryLists(id)
  return <GroceryListsPage groceryLists={groceryLists} />
})
