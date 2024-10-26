import type { Repository } from "@/std/repository"
import { computePatch } from "./compute-patch"
import {
  addHistoryEntry,
  reconstructFromHistory,
  type JsonPatchHistory,
} from "./history"
import { separateFailingOperations } from "./separate-failing-operations"

export class JsonPatchRepository<T extends object> {
  constructor(private repo: Repository<JsonPatchHistory>) {}

  #reconstruct = (
    history: JsonPatchHistory,
  ): { value: T; lastUpdate: Date } | undefined => {
    const lastUpdate = history?.at(-1)?.date
    if (!lastUpdate) return undefined
    const value = reconstructFromHistory<T>(history)
    return value && { value, lastUpdate }
  }

  findById = async (
    id: string,
  ): Promise<{ value: T; lastUpdate: Date } | undefined> => {
    const history = await this.repo.findById(id)
    return history && this.#reconstruct(history)
  }

  set = async (
    author: string,
    editedVersion: Date,
    id: string,
    nextValue: T,
  ): Promise<T> => {
    const history = await this.repo.findById(id)
    if (!history) {
      const newHistory: JsonPatchHistory[number] = {
        author,
        date: new Date(),
        patch: computePatch(undefined, nextValue as never),
      }
      await this.repo.set(id, [newHistory])
      return nextValue
    }

    const previousValue = reconstructFromHistory<T>(history, {
      until: editedVersion,
    })
    const latestValue = reconstructFromHistory<T>(history) as T
    // some operations may be duplicates.
    const safePatch = separateFailingOperations(
      latestValue,
      computePatch(previousValue as never, nextValue as never),
    )
    if (safePatch.invalid.length > 0)
      console.warn("invalid operations:", safePatch.invalid)
    if (safePatch.valid.length === 0) return latestValue // no-op

    const nextHistory = addHistoryEntry(history, {
      patch: safePatch.valid,
      author,
      date: new Date(),
    })

    const reconstructed = reconstructFromHistory<T>(nextHistory) as T
    // in case `reconstructFromHistory` throws, corrupt data isn't stored.
    await this.repo.set(id, nextHistory)
    return reconstructed
  }

  list = async (): Promise<Array<{ value: T; lastUpdate: Date }>> => {
    const histories = await this.repo.list()
    const isDefined = Boolean as unknown as <T>(
      value: T | undefined,
    ) => value is T
    return histories.map(this.#reconstruct).filter(isDefined)
  }

  remove = async (id: string): Promise<void> => {
    await this.repo.remove(id)
  }
}
