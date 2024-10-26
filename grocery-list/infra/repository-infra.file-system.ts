import { JsonPatchRepository } from "@/json-patch/repository"
import { FileSystemRepository } from "@/std/repository-file-system"
import { AccountRepository } from "@grocery-list/context/authentication/domain/account"
import { GroceryListRepository } from "@grocery-list/context/grocery-list/domain/grocery-list"
import path from "path"
import type { RepositoryInfra } from "./repository-infra"

const db = (collection: string) => path.resolve(__dirname, "../db", collection)

export const RepositoryInfraFileSystem = (): RepositoryInfra => ({
  account: new AccountRepository(
    new FileSystemRepository({ directory: db("account") }),
  ),
  groceryList: new GroceryListRepository(
    new JsonPatchRepository(
      new FileSystemRepository({ directory: db("grocery-list") }),
    ),
  ),
})
