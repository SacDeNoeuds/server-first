import type { JsonPatchHistory } from "@/json-patch/history"
import { JsonPatchRepository } from "@/json-patch/repository"
import { FileSystemRepository } from "@/std/repository"
import { schema as S } from "@/std/schema"
import { authentication } from "@grocery-list/context/authentication"
import { AccountRepository } from "@grocery-list/context/authentication/domain/account"
import { groceryList } from "@grocery-list/context/grocery-list"
import { GroceryListRepository } from "@grocery-list/context/grocery-list/domain/grocery-list"
import path from "path"
import type { RepositoryInfra } from "./repository-infra"

const db = (collection: string) => path.resolve(__dirname, "../db", collection)

export const RepositoryInfraFileSystem = (): RepositoryInfra => ({
  account: new AccountRepository(
    new FileSystemRepository({
      directory: db("account"),
      schema: authentication.Account,
    }),
  ),
  groceryList: new GroceryListRepository(
    new JsonPatchRepository({
      repo: new FileSystemRepository({
        directory: db("grocery-list"),
        schema: S.cast<JsonPatchHistory>("JsonPatchHistory"),
      }),
      schema: groceryList.GroceryList,
    }),
  ),
})
