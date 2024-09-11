import { authenticate } from "grocery-list/domain/authentication/handler/authenticate"
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

const staticFolder = path.resolve(__dirname, "../static")
const app = createApp({ debug: true })
const router = createRouter()
app.use("/static", staticHandler(staticFolder))
app.use(router)

router.get("/", defineHandler(getHome))
router.get("/test", defineHandler(getTest))
router.post("/authenticate", defineHandler(authenticate))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
