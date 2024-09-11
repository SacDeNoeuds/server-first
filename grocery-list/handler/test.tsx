import { withAuthWall } from "grocery-list/domain/authentication/handler/authenticate"

export const getTest = withAuthWall(async (params) => {
  return <div>Hello World! (Test)</div>
})
