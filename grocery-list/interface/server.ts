import { createApp, toNodeListener } from "@/h3"
import { defineUseCases } from "@/std"
import { authentication } from "@domain/authentication"
import { groceryList } from "@domain/grocery-list"
import { GroceryListApi } from "@domain/grocery-list/interface/api"
import { createServer } from "http"
import { RepositoryInfraFileSystem } from "../infra/repository-infra.file-system"
import { routerForHttpAPI } from "./http-api/router"
import { routerForHttpUI } from "./http-ui/router"

const repositoryInfra = RepositoryInfraFileSystem()
const environments = {
  groceryList: {
    queries: defineUseCases(groceryList.queries, repositoryInfra),
    commands: defineUseCases(groceryList.commands, repositoryInfra),
  },
  authentication: {
    queries: defineUseCases(authentication.queries, repositoryInfra),
    commands: defineUseCases(authentication.commands, repositoryInfra),
  },
}

const groceryListApi = GroceryListApi(environments.groceryList)

const app = createApp({
  debug: true,
  onRequest: (event) => {
    console.info("request", {
      method: event.method,
      path: event.path,
    })
  },
})
app.use(routerForHttpUI({ config: { protocol: "http" }, ...environments }))
app.use(routerForHttpAPI({ config: { protocol: "http" }, ...environments }))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
