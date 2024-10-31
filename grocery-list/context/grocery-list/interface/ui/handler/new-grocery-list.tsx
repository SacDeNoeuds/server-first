import { schema as S } from "@/std/schema"
import { redirectTo } from "@/std/web/server-handler"
import { withAuthWall } from "@domain/authentication/interface/ui"
import { useCase } from "@domain/grocery-list/domain"
import { ListName } from "@domain/grocery-list/domain/grocery-list"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

export const createGroceryList = withAuthWall(async (ctx) => {
  const Payload = S.object({
    name: ListName,
  })

  const body = Payload.decode(ctx.body)
  if (S.isFailure(body)) {
    console.warn("error", body)
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

  const groceryList = await useCase.createGroceryList({
    account: ctx.account,
    name: body.value.name,
  })

  return redirectTo(new URL(`/grocery-list/${groceryList.id}`, ctx.url))
})
