import { withAuthWall } from "grocery-list/domain/authentication/handler/authenticate"
import { getInfra } from "grocery-list/infra/infra"
import { redirectTo } from "library/std/server-handler"
import { StringId } from "library/std/string-id"
import { object, string, trimmed } from "superstruct"
import { NewGroceryListForm } from "../components/new-grocery-list-form"
import { PageLayout } from "../components/page-layout"

export const newGroceryListPage = withAuthWall(async (params) => {
  return (
    <PageLayout heading="Your New Grocery List">
      <NewGroceryListForm values={{ name: "" }} />
    </PageLayout>
  )
})

export const createGroceryList = withAuthWall(async (params) => {
  const Payload = object({
    name: trimmed(string()),
  })

  const [error, body] = Payload.validate(params.body)

  if (body) {
    const { repository } = getInfra()
    const id = StringId()
    await repository.groceryList.set({
      id,
      items: [],
      name: body.name,
      peers: [params.account.email],
    })
    return redirectTo(new URL(`/grocery-list/${id}`, params.url))
  }

  console.warn("error", error)

  return (
    <PageLayout heading="Your New Grocery List">
      <NewGroceryListForm
        values={{ name: "" }}
        errors={{
          name: "We could not create your grocery list, please try again",
        }}
      />
    </PageLayout>
  )
})
