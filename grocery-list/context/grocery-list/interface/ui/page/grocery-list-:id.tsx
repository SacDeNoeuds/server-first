import type { ServerHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import type { GroceryList } from "@domain/grocery-list/domain"
import type { JSX } from "jsx-server/jsx-runtime"
import { GroceryListPage } from "../components/grocery-list-page"

type Handler = ServerHandler<
  JSX.Element,
  { account: authentication.Account; groceryList: GroceryList }
>

export const getGroceryListPageHandler: Handler = async (ctx) => {
  return (
    <GroceryListPage
      groceryList={ctx.groceryList}
      joinUrl={new URL(`/join-grocery-list/${ctx.groceryList.id}`, ctx.url)}
    />
  )
}
