import { BadRequest } from "@/std/http-error"
import type { Handler } from "@/std/server-handler"
import type { JSX } from "jsx-server/jsx-runtime"
import { getInfra } from "../../../infra/infra"
import type { Account } from "../../authentication/entity/account"
import { withAuthWall } from "../../authentication/handler/authenticate"
import { GroceryListPage } from "../components/grocery-list-page"
import { NotFoundPage } from "../components/not-found-page"
import type { GroceryList } from "../entity/grocery-list"

export const withGroceryList = (
  handler: Handler<JSX.Child, { account: Account; groceryList: GroceryList }>,
): Handler =>
  withAuthWall(async (ctx) => {
    const id = ctx.params.id
    if (!id) return BadRequest({ message: "please provide an id" })
    const { repository } = getInfra()
    const groceryList = await repository.groceryList.find(id)
    if (!groceryList || !ctx.account.groceryLists.includes(groceryList.id)) {
      ctx.setStatus(404)
      return <NotFoundPage message={`grocery list "${id}" does not exist 🧐`} />
    }
    return handler({ ...ctx, groceryList })
  })

export const getGroceryListPage = withGroceryList(async (ctx) => {
  return (
    <GroceryListPage
      groceryList={ctx.groceryList}
      joinUrl={new URL(`/join-grocery-list/${ctx.groceryList.id}`, ctx.url)}
    />
  )
})
