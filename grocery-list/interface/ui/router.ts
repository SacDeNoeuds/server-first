import { createRouter, DefineHandler, staticHandler, type Router } from "@/h3"
import { authenticate, logout } from "@domain/authentication/interface/ui"
import { addGroceryListItem } from "@domain/grocery-list/interface/ui/handler/add-grocery-list-item-:id"
import { editGroceryListItem } from "@domain/grocery-list/interface/ui/handler/edit-grocery-list-item-:id"
import { joinGroceryList } from "@domain/grocery-list/interface/ui/handler/join-grocery-list-:id"
import { createGroceryList } from "@domain/grocery-list/interface/ui/handler/new-grocery-list"
import { tickGroceryListItem } from "@domain/grocery-list/interface/ui/handler/tick-grocery-list-item-:id"
import { getGroceryListPage } from "@domain/grocery-list/interface/ui/page/grocery-list-:id"
import { getGroceryListsPage } from "@domain/grocery-list/interface/ui/page/grocery-lists"
import path from "node:path"
import { getHomePage } from "./home"

type Config = {
  protocol: "http" | "https"
}
export function routerForUI(config: Config): Router {
  const router = createRouter()
  const defineHandler = DefineHandler({ protocol: config.protocol })

  const staticFolder = path.resolve(__dirname, "../../shared/ui/static")
  router.use("/static", staticHandler(staticFolder))

  router.get("/", defineHandler(getHomePage))
  router.post("/authenticate", defineHandler(authenticate))
  router.post("/logout", defineHandler(logout))
  router.post("/new-grocery-list", defineHandler(createGroceryList))
  router.get("/grocery-lists", defineHandler(getGroceryListsPage))
  router.get("/grocery-list/:id", defineHandler(getGroceryListPage))
  router.get("/join-grocery-list/:id", defineHandler(joinGroceryList))
  router.post("/add-grocery-list-item/:id", defineHandler(addGroceryListItem))
  router.post("/edit-grocery-list-item/:id", defineHandler(editGroceryListItem))
  router.post("/tick-grocery-list-item/:id", defineHandler(tickGroceryListItem))

  return router
}
