import { JsonPatchRepository } from "@/json-patch/repository"
import { FileSystemRepository } from "@/std/repository-file-system"
import path from "path"
import { AccountRepository } from "../domain/authentication/repository/account-repo"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

const db = (collection: string) => path.resolve(__dirname, "../db", collection)

export const InfraFileSystem = (): Infra => ({
  repository: {
    account: new AccountRepository(
      new FileSystemRepository({ directory: db("account") }),
    ),
    groceryList: new GroceryListRepository(
      new JsonPatchRepository(
        new FileSystemRepository({ directory: db("grocery-list") }),
      ),
    ),
  },
})
