import { redirectTo } from "@/std/server-handler"
import { StringId } from "@/std/string-id"
import { create, object, string, trimmed } from "superstruct"
import { getInfra } from "../../../infra/infra"
import { withAuthWall } from "../../authentication/handler/authenticate"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

export const createGroceryList = withAuthWall(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
  })

  try {
    const body = create(ctx.body, Payload)
    const { repository } = getInfra()
    const id = StringId()
    await Promise.all([
      repository.groceryList.set(ctx.account.email, new Date(), {
        id,
        items: {},
        name: body.name,
      }),
      repository.account.addGroceryList(ctx.account.email, id),
    ])

    return redirectTo(new URL(`/grocery-list/${id}`, ctx.url))
  } catch (error) {
    console.warn("error", error)
    return (
      <PageLayout heading="New Grocery List">
        <NewGroceryListForm
          errors={{
            name: "We could not create your grocery list, please try again",
          }}
        />
      </PageLayout>
    )
  }
})
