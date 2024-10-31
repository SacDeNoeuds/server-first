import { createApp, toNodeListener } from "@/h3"
import { authentication } from "@domain/authentication"
import { groceryList } from "@domain/grocery-list"
import { createServer } from "http"
import { RepositoryInfraFileSystem } from "../infra/repository-infra.file-system"
import { routerForAPI } from "./api/router"
import { routerForUI } from "./ui/router"

const repositoryInfra = RepositoryInfraFileSystem()
authentication.registerUseCases({
  account: repositoryInfra.account,
})
groceryList.registerUseCases({
  groceryList: repositoryInfra.groceryList,
})

const app = createApp({ debug: true })
app.use(routerForUI({ protocol: "http" }))
app.use(routerForAPI({ protocol: "http" }))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
