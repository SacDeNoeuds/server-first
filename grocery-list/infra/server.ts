import { authenticate } from "grocery-list/domain/authentication/handler/authenticate"
import { getGroceryListPage } from "grocery-list/domain/grocery-list/handler/grocery-list-page"
import {
  createGroceryList,
  newGroceryListPage,
} from "grocery-list/domain/grocery-list/handler/new-grocery-list"
import { getHome } from "grocery-list/handler/home"
import { getTest } from "grocery-list/handler/test"
import { createServer } from "http"
import {
  createApp,
  createRouter,
  defineHandler,
  staticHandler,
  toNodeListener,
} from "library/h3"
import path from "node:path"
import { provideInfra } from "./infra"
import { InfraInMemory } from "./infra.in-memory"

provideInfra(InfraInMemory())

const staticFolder = path.resolve(__dirname, "../static")
const app = createApp({ debug: true })
const router = createRouter()
app.use("/static", staticHandler(staticFolder))
app.use(router)

router.get("/", defineHandler(getHome))
router.get("/test", defineHandler(getTest))
router.post("/authenticate", defineHandler(authenticate))
router.get("/new-grocery-list", defineHandler(newGroceryListPage))
router.post("/new-grocery-list", defineHandler(createGroceryList))
router.get("/grocery-list/:id", defineHandler(getGroceryListPage))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
