import type { JsonPatchHistory } from "@/json-patch/history"
import { JsonPatchRepository } from "@/json-patch/repository"
import { std } from "@/std"
import { FileSystemRepository } from "@/std/repository"
import { schema as S } from "@/std/schema"
import { authentication } from "@domain/authentication"
import { AccountRepository } from "@domain/authentication/domain/account"
import { groceryList } from "@domain/grocery-list"
import { GroceryListRepository } from "@domain/grocery-list/domain/grocery-list"
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
      schema: std.pipe(groceryList.GroceryList, S.object.omit("lastUpdate")),
    }),
  ),
})
