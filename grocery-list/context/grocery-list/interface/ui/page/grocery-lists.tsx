import { withAuthWall } from "@grocery-list/context/authentication/interface/ui"
import { useCase } from "@grocery-list/context/grocery-list/domain"
import { GroceryListsPage } from "../components/grocery-lists-page"

export const getGroceryListsPage = withAuthWall(async (ctx) => {
  const groceryLists = await useCase.listParticipantGroceryLists(ctx.account.id)
  return <GroceryListsPage groceryLists={groceryLists} />
})
