import { withAuthWall } from "grocery-list/domain/authentication/handler/authenticate"
import { Html } from "grocery-list/ui-kit/html"

export const getTest = withAuthWall(async (params) => {
  return (
    <Html>
      <div>Hello World! (Test)</div>
    </Html>
  )
})
