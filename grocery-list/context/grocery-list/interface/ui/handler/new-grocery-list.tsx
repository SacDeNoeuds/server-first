import { redirectTo } from "@/std/server-handler"
import { withAuthWall } from "@grocery-list/context/authentication/interface/ui"
import { useCase } from "@grocery-list/context/grocery-list/domain"
import { create, object, string, trimmed } from "superstruct"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

export const createGroceryList = withAuthWall(async (ctx) => {
  const Payload = object({
    name: trimmed(string()),
  })
  const now = new Date()

  try {
    const body = create(ctx.body, Payload)
    const groceryList = await useCase.createGroceryList({
      account: ctx.account,
      name: body.name,
    })

    return redirectTo(new URL(`/grocery-list/${groceryList.id}`, ctx.url))
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
