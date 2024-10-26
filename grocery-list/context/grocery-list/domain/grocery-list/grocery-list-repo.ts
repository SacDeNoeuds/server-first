import type { JsonPatchRepository } from "@/json-patch/repository"
import type {
  GroceryList,
  GroceryListItem,
  GroceryListParticipant,
} from "./grocery-list"

type StoredValue = Omit<GroceryList, "lastUpdate" | "items"> & {
  items: Record<GroceryListItem["name"], Omit<GroceryListItem, "name">>
}
export class GroceryListRepository {
  constructor(private repo: JsonPatchRepository<StoredValue>) {}

  #revive = (item: { value: StoredValue; lastUpdate: Date }): GroceryList => ({
    ...item.value,
    items: new Map(Object.entries(item.value.items)),
    lastUpdate: item.lastUpdate,
  })

  set = async (
    author: string,
    at: Date,
    groceryList: Omit<GroceryList, "lastUpdate">,
  ): Promise<void> => {
    await this.repo.set(author, at, groceryList.id, {
      ...groceryList,
      items: Object.fromEntries(groceryList.items),
    })
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
