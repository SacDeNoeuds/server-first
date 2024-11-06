import { createRouter, DefineHandler, staticHandler, type Router } from "@/h3"
import { std } from "@/std"
import { JsxHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { AuthenticateHandler } from "@domain/authentication/interface/ui/authenticate"
import { logoutHandler } from "@domain/authentication/interface/ui/logout"
import { WithAuthWall } from "@domain/authentication/interface/ui/with-auth-wall"
import type { groceryList } from "@domain/grocery-list"
import { AddGroceryListItemHandler } from "@domain/grocery-list/interface/ui/handler/add-grocery-list-item-:id"
import { CreateGroceryListHandler } from "@domain/grocery-list/interface/ui/handler/create-grocery-list"
import { EditGroceryListItemHandler } from "@domain/grocery-list/interface/ui/handler/edit-grocery-list-item-:id"
import { JoinGroceryListHandler } from "@domain/grocery-list/interface/ui/handler/join-grocery-list-:id"
import { TickGroceryListItemHandler } from "@domain/grocery-list/interface/ui/handler/tick-grocery-list-item-:id"
import { WithGroceryList } from "@domain/grocery-list/interface/ui/middleware/with-grocery-list"
import { getGroceryListPageHandler } from "@domain/grocery-list/interface/ui/page/grocery-list-:id"
import { GetGroceryListsPageHandler } from "@domain/grocery-list/interface/ui/page/grocery-lists"
import path from "node:path"
import { getHomePageHandler } from "./home"

type Config = {
  protocol: "http" | "https"
}
export function routerForUI(options: {
  config: Config
  useCase: {
    groceryList: groceryList.UseCases
    authentication: authentication.UseCases
  }
}): Router {
  const { config, useCase } = options
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })
  const withAuthWall = WithAuthWall(useCase.authentication)
  const withGroceryList = WithGroceryList(useCase.groceryList)

  const staticFolder = path.resolve(__dirname, "../../shared/ui")
  console.info("static folder", staticFolder)
  router.use("/static/*", staticHandler(staticFolder))
  router.use("/static/*/*", staticHandler(staticFolder))

  router.get("/", defineHandler(getHomePageHandler))
  router.post(
    "/authenticate",
    std.pipe(AuthenticateHandler(useCase.authentication), defineHandler),
  )
  router.post("/logout", defineHandler(logoutHandler))

  router.post(
    "/new-grocery-list",
    std.pipe(
      CreateGroceryListHandler(useCase.groceryList),
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.get(
    "/grocery-lists",
    std.pipe(
      GetGroceryListsPageHandler(useCase.groceryList),
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.get(
    "/grocery-list/:id",
    std.pipe(
      getGroceryListPageHandler,
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.get(
    "/join-grocery-list/:id",
    std.pipe(
      JoinGroceryListHandler(useCase.groceryList),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/add-grocery-list-item/:id",
    std.pipe(
      AddGroceryListItemHandler(useCase.groceryList),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/edit-grocery-list-item/:id",
    std.pipe(
      EditGroceryListItemHandler(useCase.groceryList),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/tick-grocery-list-item/:id",
    std.pipe(
      TickGroceryListItemHandler(useCase.groceryList),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )

  return router
}
