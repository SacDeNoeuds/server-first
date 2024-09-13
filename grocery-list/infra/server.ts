import {
  createApp,
  createRouter,
  defineHandler,
  staticHandler,
  toNodeListener,
} from "@/h3"
import { createServer } from "http"
import path from "node:path"
import { authenticate } from "../domain/authentication/handler/authenticate"
import { logout } from "../domain/authentication/handler/logout"
import { addGroceryListItem } from "../domain/grocery-list/handler/add-grocery-list-item-:id"
import { editGroceryListItem } from "../domain/grocery-list/handler/edit-grocery-list-item-:id"
import { getGroceryListPage } from "../domain/grocery-list/handler/grocery-list-:id"
import { getGroceryListsPage } from "../domain/grocery-list/handler/grocery-lists"
import { joinGroceryList } from "../domain/grocery-list/handler/join-grocery-list-:id"
import { createGroceryList } from "../domain/grocery-list/handler/new-grocery-list"
import { tickGroceryListItem } from "../domain/grocery-list/handler/tick-grocery-list-item-:id"
import { getHomePage } from "../handler/home"
import { provideInfra } from "./infra"
import { InfraFileSystem } from "./infra.file-system"

provideInfra(InfraFileSystem())

const staticFolder = path.resolve(__dirname, "../static")
const app = createApp({ debug: true })
const router = createRouter()
app.use("/static", staticHandler(staticFolder))
app.use(router)

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

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
