import type { JsonPatchRepository } from "@/json-patch/repository"
import type { GroceryList } from "../entity/grocery-list"

export class GroceryListRepository {
  constructor(
    private repo: JsonPatchRepository<Omit<GroceryList, "lastUpdate">>,
  ) {}

  set = async (
    author: string,
    at: Date,
    groceryList: Omit<GroceryList, "lastUpdate">,
  ): Promise<void> => {
    await this.repo.set(author, at, groceryList.id, groceryList)
  }

  find = async (id: string): Promise<GroceryList | undefined> => {
    const [value, lastUpdate] = await this.repo.findById(id)
    return value && { ...value, lastUpdate }
  }

  remove = (id: string): Promise<void> => {
    return this.repo.remove(id)
  }
}

export class GroceryListNotFound {
  constructor(public readonly id: string) {}
}
