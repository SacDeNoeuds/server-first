import { authenticate } from "grocery-list/domain/authentication/handler/authenticate"
import { getHome } from "grocery-list/handler/home"
import { getTest } from "grocery-list/handler/test"
import { createServer } from "http"
import {
  createApp,
  createRouter,
  defineHandler,
  toNodeListener,
} from "library/h3"

const app = createApp({ debug: true })
const router = createRouter()
app.use(router)

router.get("/", defineHandler(getHome))
router.get("/test", defineHandler(getTest))
router.post("/authenticate", defineHandler(authenticate))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
