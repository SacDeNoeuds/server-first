import { GroceryListPage } from "../components/grocery-list-page"
import { withGroceryList } from "../middleware/with-grocery-list"

export const getGroceryListPage = withGroceryList(async (ctx) => {
  return (
    <GroceryListPage
      groceryList={ctx.groceryList}
      joinUrl={new URL(`/join-grocery-list/${ctx.groceryList.id}`, ctx.url)}
    />
  )
})
