import { FileSystemRepository } from "@/std/repository-file-system"
import path from "path"
import { AccountRepository } from "../domain/authentication/repository/account-repo"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

export const InfraFileSystem = (): Infra => ({
  repository: {
    account: new AccountRepository(
      new FileSystemRepository({
        directory: path.resolve(__dirname, "../db/account"),
        mapId: (account) => account.email,
      }),
    ),
    groceryList: new GroceryListRepository(
      new FileSystemRepository({
        mapId: (list) => list.id,
        directory: path.resolve(__dirname, "../db/grocery-list"),
      }),
    ),
  },
})
