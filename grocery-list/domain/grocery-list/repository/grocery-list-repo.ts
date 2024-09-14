import type { JsonPatchRepository } from "@/json-patch/repository"
import type { GroceryList } from "../entity/grocery-list"

export class GroceryListRepository {
  constructor(private repo: JsonPatchRepository<GroceryList>) {}

  set = async (
    author: string,
    at: Date,
    groceryList: GroceryList,
  ): Promise<void> => {
    await this.repo.set(author, at, groceryList.id, groceryList)
  }

  find = async (id: string): Promise<GroceryList | undefined> => {
    return this.repo.findById(id)
  }

  remove = (id: string): Promise<void> => {
    return this.repo.remove(id)
  }
}

export class GroceryListNotFound {
  constructor(public readonly id: string) {}
}
