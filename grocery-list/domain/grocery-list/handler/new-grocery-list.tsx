import { redirectTo } from "@/std/server-handler"
import { StringId } from "@/std/string-id"
import { create, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withAuthWall } from "../../authentication/handler/authenticate"
import { NewGroceryListPage } from "../components/new-grocery-list-page"

export const getNewGroceryListPage = withAuthWall(async (ctx) => {
  return <NewGroceryListPage />
})

export const createGroceryList = withAuthWall(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
  })

  try {
    const body = create(ctx.body, Payload)
    const { repository } = getInfra()
    const id = StringId()
    await repository.groceryList.set({
      id,
      items: [],
      name: body.name,
      peers: [ctx.account.email],
    })

    return redirectTo(new URL(`/grocery-list/${id}`, ctx.url))
  } catch (error) {
    console.warn("error", error)
    return (
      <NewGroceryListPage
        errors={{
          name: "We could not create your grocery list, please try again",
        }}
      />
    )
  }
})
