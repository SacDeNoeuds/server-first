import type { JsonPatchRepository } from "@/json-patch/repository"
import { type GroceryList, type GroceryListParticipant } from "./grocery-list"

export class GroceryListRepository {
  constructor(
    private repo: JsonPatchRepository<Omit<GroceryList, "lastUpdate">>,
  ) {}

  #revive = (item: {
    value: Omit<GroceryList, "lastUpdate">
    lastUpdate: Date
  }): GroceryList => ({
    ...item.value,
    lastUpdate: item.lastUpdate,
  })

  set = async (
    author: string,
    at: Date,
    groceryList: Omit<GroceryList, "lastUpdate">,
  ): Promise<void> => {
    await this.repo.set(author, at, groceryList.id, groceryList)
  }

  find = async (id: string): Promise<GroceryList | undefined> => {
    const item = await this.repo.findById(id)
    return item && this.#revive(item)
  }

  remove = (id: string): Promise<void> => {
    return this.repo.remove(id)
  }

  listByParticipant = async (
    participant: GroceryListParticipant,
  ): Promise<GroceryList[]> => {
    const list = await this.repo.list()
    return list
      .filter((item) => item.value.participants.has(participant))
      .map(this.#revive)
  }
}

export class GroceryListNotFound {
  constructor(public readonly id: string) {}
}
