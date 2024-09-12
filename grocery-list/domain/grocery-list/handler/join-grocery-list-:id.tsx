import { BadRequest } from "@/std/http-error"
import { redirectTo } from "@/std/server-handler"
import { getInfra } from "../../../infra/infra"
import { Html } from "../../../ui-kit/html"
import { withAuthWall } from "../../authentication/handler/authenticate"

export const joinGroceryList = withAuthWall(async (ctx) => {
  const id = ctx.params.id
  if (!id) return BadRequest({ message: "please provide an id" })
  const { repository } = getInfra()
  const groceryList = await repository.groceryList.find(id)

  if (!groceryList) {
    ctx.setStatus(404)
    return (
      <Html>
        <h2>This grocery list does not exist</h2>
        <p>Try asking your partner/flatmate to send you the link once again?</p>
      </Html>
    )
  }

  await repository.groceryList.set({
    ...groceryList,
    peers: [...groceryList.peers, ctx.account.email],
  })

  return redirectTo(new URL(`/grocery-list/${id}`, ctx.url))
})
