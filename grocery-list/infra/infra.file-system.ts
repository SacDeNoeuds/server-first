import { FileSystemRepository } from "@/std/repository-file-system"
import path from "path"
import { GroceryListRepository } from "../domain/grocery-list/repository/grocery-list-repo"
import type { Infra } from "./infra"

export const InfraFileSystem = (): Infra => ({
  repository: {
    groceryList: new GroceryListRepository(
      new FileSystemRepository({
        mapId: (list) => list.id,
        directory: path.resolve(__dirname, "../db/grocery-list"),
      }),
    ),
  },
})
