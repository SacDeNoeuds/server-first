import type { Repository } from "@/std/repository"
import type { GroceryList } from "../entity/grocery-list"

export class GroceryListRepository {
  constructor(private repo: Repository<GroceryList>) {}

  set = async (groceryList: GroceryList): Promise<void> => {
    await this.repo.set(groceryList)
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
