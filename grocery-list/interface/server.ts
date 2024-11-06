import { createApp, toNodeListener } from "@/h3"
import { defineUseCases } from "@/std"
import { authentication } from "@domain/authentication"
import { groceryList } from "@domain/grocery-list"
import { createServer } from "http"
import { RepositoryInfraFileSystem } from "../infra/repository-infra.file-system"
import { routerForAPI } from "./api/router"
import { routerForUI } from "./ui/router"

const repositoryInfra = RepositoryInfraFileSystem()
const useCase = {
  groceryList: defineUseCases(groceryList.useCases, repositoryInfra),
  authentication: defineUseCases(authentication.useCases, repositoryInfra),
}

const app = createApp({
  debug: true,
  onRequest: (event) => {
    console.info("request", {
      method: event.method,
      path: event.path,
    })
  },
})
app.use(routerForUI({ config: { protocol: "http" }, useCase }))
app.use(routerForAPI({ config: { protocol: "http" }, useCase }))

const server = createServer(toNodeListener(app))
const port = 3000

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
