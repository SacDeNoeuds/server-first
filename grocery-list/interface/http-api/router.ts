import { createRouter, DefineHandler, type Router } from "@/h3"
import { std } from "@/std"
import { Forbidden } from "@/std/web/http-error"
import { withAuth } from "@domain/authentication/interface/http-api/with-auth"
import type { groceryList } from "@domain/grocery-list"
import { GetGroceryListsHandler } from "@domain/grocery-list/interface/http-api/get-lists"

type Config = {
  protocol: "http" | "https"
}
export function routerForHttpAPI(options: {
  config: Config
  groceryList: {
    queries: groceryList.Queries
  }
}): Router {
  const { config } = options
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })

  router.get(
    "/",
    std.pipe(
      GetGroceryListsHandler(options.groceryList.queries),
      withAuth(() => Forbidden({ message: "We don’t know you" })),
      defineHandler,
    ),
  )

  return router
}
