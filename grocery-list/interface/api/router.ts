import { createRouter, DefineHandler, type Router } from "@/h3"
import { getGroceryLists } from "@domain/grocery-list/interface/api/get-lists"

type Config = {
  protocol: "http" | "https"
}
export function routerForAPI(config: Config): Router {
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })

  router.get("/", defineHandler(getGroceryLists))

  return router
}
