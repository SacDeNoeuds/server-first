import type { JsonPatchRepository } from "@/json-patch/repository"
import { tagged } from "@/std"
import type { GroceryListJsonTransferObject } from "../data-transfer-object/json"
import type { GroceryList } from "../grocery-list"
import type { Participant } from "../value-object/participant"

export class GroceryListRepository {
  constructor(
    private repo: JsonPatchRepository<
      GroceryList,
      GroceryListJsonTransferObject
    >,
  ) {}

  set = async (
    author: string,
    editedVersion: Date,
    groceryList: GroceryList,
  ): Promise<void> => {
    await this.repo.set(author, editedVersion, groceryList.id, groceryList)
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

export class GroceryListNotFound extends tagged.Class("GroceryListNotFound")<{
  id: string
}> {}
