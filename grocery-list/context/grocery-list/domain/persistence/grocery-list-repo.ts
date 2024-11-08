import type { JsonPatchRepository } from "@/json-patch/repository"
import type { GroceryList } from "../grocery-list"
import type { Participant } from "../value-object/participant"

export class GroceryListRepository {
  constructor(private repo: JsonPatchRepository<GroceryList>) {}

  // #revive = (item: {
  //   value: Omit<GroceryList, "lastUpdate">
  //   lastUpdate: Date
  // }): GroceryList => ({
  //   ...item.value,
  //   lastUpdate: item.lastUpdate,
  // })

  set = async (
    author: string,
    at: Date,
    groceryList: GroceryList,
  ): Promise<void> => {
    await this.repo.set(author, at, groceryList.id, groceryList)
  }

  find = async (
    id: string,
  ): Promise<{ value: GroceryList; lastUpdate: Date } | undefined> => {
    return this.repo.findById(id)
  }

  remove = (id: string): Promise<void> => {
    return this.repo.remove(id)
  }

  listByParticipant = async (
    participant: Participant,
  ): Promise<{ value: GroceryList; lastUpdate: Date }[]> => {
    const list = await this.repo.list()
    return list.filter((item) => item.value.participants.has(participant))
  }
}

export class GroceryListNotFound {
  constructor(public readonly id: string) {}
}
