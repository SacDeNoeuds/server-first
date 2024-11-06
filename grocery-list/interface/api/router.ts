import { createRouter, DefineHandler, type Router } from "@/h3"
import { std } from "@/std"
import { Forbidden } from "@/std/web/http-error"
import type { authentication } from "@domain/authentication"
import { withAuth } from "@domain/authentication/interface/api/with-auth"
import type { groceryList } from "@domain/grocery-list"
import { GetGroceryListsHandler } from "@domain/grocery-list/interface/api/get-lists"

type Config = {
  protocol: "http" | "https"
}
export function routerForAPI(options: {
  config: Config
  useCase: {
    authentication: authentication.UseCases
    groceryList: groceryList.UseCases
  }
}): Router {
  const { config, useCase } = options
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })

  router.get(
    "/",
    std.pipe(
      GetGroceryListsHandler(useCase.groceryList),
      withAuth(() => Forbidden({ message: "We don’t know you" })),
      defineHandler,
    ),
  )

  return router
}
