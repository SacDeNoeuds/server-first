import { getInfra } from "../../../infra/infra"
import { withAuthWall } from "../../authentication/handler/authenticate"
import { GroceryListsPage } from "../components/grocery-lists-page"

export const getGroceryListsPage = withAuthWall(async (ctx) => {
  const { repository } = getInfra()
  const groceryLists = await Promise.all(
    ctx.account.groceryLists.map(repository.groceryList.find),
  )
  const isDefined = Boolean as unknown as <T>(x: T | undefined) => x is T
  return <GroceryListsPage groceryLists={groceryLists.filter(isDefined)} />
})
