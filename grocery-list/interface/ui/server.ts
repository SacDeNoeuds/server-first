import {
  createApp,
  createRouter,
  DefineHandler,
  staticHandler,
  toNodeListener,
} from "@/h3"
import { authentication } from "@grocery-list/context/authentication"
import {
  authenticate,
  logout,
} from "@grocery-list/context/authentication/interface/ui"
import { groceryList } from "@grocery-list/context/grocery-list"
import { addGroceryListItem } from "@grocery-list/context/grocery-list/interface/ui/handler/add-grocery-list-item-:id"
import { editGroceryListItem } from "@grocery-list/context/grocery-list/interface/ui/handler/edit-grocery-list-item-:id"
import { joinGroceryList } from "@grocery-list/context/grocery-list/interface/ui/handler/join-grocery-list-:id"
import { createGroceryList } from "@grocery-list/context/grocery-list/interface/ui/handler/new-grocery-list"
import { tickGroceryListItem } from "@grocery-list/context/grocery-list/interface/ui/handler/tick-grocery-list-item-:id"
import { getGroceryListPage } from "@grocery-list/context/grocery-list/interface/ui/page/grocery-list-:id"
import { getGroceryListsPage } from "@grocery-list/context/grocery-list/interface/ui/page/grocery-lists"
import { RepositoryInfraFileSystem } from "@grocery-list/infra/repository-infra.file-system"
import { createServer } from "http"
import path from "node:path"
import { getHomePage } from "./home"

const repositoryInfra = RepositoryInfraFileSystem()
authentication.registerUseCases({
  account: repositoryInfra.account,
})
groceryList.registerUseCases({
  groceryList: repositoryInfra.groceryList,
})

const staticFolder = path.resolve(__dirname, "../../shared/ui/static")
console.info("static folder", staticFolder)
const app = createApp({ debug: true })
const router = createRouter()
app.use("/static", staticHandler(staticFolder))
app.use(router)

const defineHandler = DefineHandler({ protocol: "http" })

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
