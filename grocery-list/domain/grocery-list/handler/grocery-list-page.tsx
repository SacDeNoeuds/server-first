import { withAuthWall } from "grocery-list/domain/authentication/handler/authenticate"
import { getInfra } from "grocery-list/infra/infra"
import { BadRequest, NotFound } from "library/std/http-error"
import { PageLayout } from "../components/page-layout"

export const getGroceryListPage = withAuthWall(async (params) => {
  const id = params.params.id
  if (!id) return BadRequest({ message: "please provide an id" })
  const { repository } = getInfra()
  const groceryList = await repository.groceryList.find(id)
  if (!groceryList)
    return NotFound({ message: `grocery list "${id}" does not exist` })

  console.dir(groceryList, { depth: null })
  return (
    <PageLayout heading={groceryList.name}>
      {groceryList.items.length === 0 && (
        <div>You don’t have any item yet.</div>
      )}

      {groceryList.items.map((item) => (
        <div class="grocery-list-item" style="padding-block: 0.5rem">
          {item.name} – {item.quantity}
        </div>
      ))}

      <button type="button">Add</button>
    </PageLayout>
  )
})
