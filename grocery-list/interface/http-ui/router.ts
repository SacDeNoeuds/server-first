import { createRouter, DefineHandler, staticHandler, type Router } from "@/h3"
import { std } from "@/std"
import { JsxHandler } from "@/std/web/server-handler"
import type { authentication } from "@domain/authentication"
import { logoutHandler } from "@domain/authentication/interface/http-ui/logout-handler"
import { SignInOrSignUpHandler } from "@domain/authentication/interface/http-ui/sign-in-or-sign-up-handler"
import { WithAuthWall } from "@domain/authentication/interface/http-ui/with-auth-wall"
import type { groceryList } from "@domain/grocery-list"
import { AddGroceryListItemHttpUiHandler } from "@domain/grocery-list/interface/http-ui/command/add-grocery-list-item-:id"
import { CreateGroceryListHttpUiHandler } from "@domain/grocery-list/interface/http-ui/command/create-grocery-list"
import { EditGroceryListItemHttpUiHandler } from "@domain/grocery-list/interface/http-ui/command/edit-grocery-list-item-:id"
import { JoinGroceryListHttpUiHandler } from "@domain/grocery-list/interface/http-ui/command/join-grocery-list-:id"
import { TickGroceryListItemHttpUiHandler } from "@domain/grocery-list/interface/http-ui/command/tick-grocery-list-item-:id"
import { WithGroceryList } from "@domain/grocery-list/interface/http-ui/middleware/with-grocery-list"
import { getGroceryListPageHandler } from "@domain/grocery-list/interface/http-ui/page/grocery-list-:id"
import { GetGroceryListsPageHandler } from "@domain/grocery-list/interface/http-ui/page/grocery-lists"
import path from "node:path"
import { getHomePageHandler } from "./home"

type Config = {
  protocol: "http" | "https"
}
export function routerForHttpUI(options: {
  config: Config
  groceryList: {
    queries: groceryList.Queries
    commands: groceryList.Commands
  }
  authentication: {
    commands: authentication.Commands
    queries: authentication.Queries
  }
}): Router {
  const { config } = options
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })
  const withAuthWall = WithAuthWall(options.authentication.queries)
  const withGroceryList = WithGroceryList(options.groceryList.queries)

  const staticFolder = path.resolve(__dirname, "../../shared/http-ui")
  console.info("static folder", staticFolder)
  router.use("/static/*", staticHandler(staticFolder))
  router.use("/static/*/*", staticHandler(staticFolder))

  router.get("/", defineHandler(getHomePageHandler))
  router.post(
    "/authenticate",
    std.pipe(
      SignInOrSignUpHandler(options.authentication.commands),
      defineHandler,
    ),
  )
  router.post("/logout", defineHandler(logoutHandler))

  router.post(
    "/new-grocery-list",
    std.pipe(
      CreateGroceryListHttpUiHandler(options.groceryList.commands),
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.get(
    "/grocery-lists",
    std.pipe(
      GetGroceryListsPageHandler(options.groceryList.queries),
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
      JoinGroceryListHttpUiHandler(options.groceryList.commands),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/add-grocery-list-item/:id",
    std.pipe(
      AddGroceryListItemHttpUiHandler(options.groceryList.commands),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/edit-grocery-list-item/:id",
    std.pipe(
      EditGroceryListItemHttpUiHandler(options.groceryList.commands),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )
  router.post(
    "/tick-grocery-list-item/:id",
    std.pipe(
      TickGroceryListItemHttpUiHandler(options.groceryList.commands),
      withGroceryList,
      withAuthWall,
      JsxHandler,
      defineHandler,
    ),
  )

  return router
}
