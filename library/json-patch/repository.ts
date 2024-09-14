import type { Repository } from "@/std/repository"
import { computePatch } from "./compute-patch"
import { reconstructFromHistory, type JsonPatchHistory } from "./history"

export class JsonPatchRepository<T> {
  constructor(private repo: Repository<JsonPatchHistory>) {}

  findById = async (id: string): Promise<T | undefined> => {
    const history = await this.repo.findById(id)
    if (!history) return undefined
    return reconstructFromHistory<T>(history)
  }
  set = async (
    author: string,
    lastUpdate: Date,
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
      until: lastUpdate,
    })
    const patch = computePatch(previousValue as never, nextValue as never)
    const nextHistory: JsonPatchHistory = [
      ...history,
      { patch, author, date: new Date() },
    ].sort((a, b) => a.date.valueOf() - b.date.valueOf())
    await this.repo.set(id, nextHistory)
    return reconstructFromHistory<T>(nextHistory) as T
  }

  list = async (): Promise<T[]> => {
    const histories = await this.repo.list()
    const isDefined = Boolean as unknown as <T>(
      value: T | undefined,
    ) => value is T
    return histories
      .map((history) => reconstructFromHistory<T>(history))
      .filter(isDefined)
  }

  remove = async (id: string): Promise<void> => {
    await this.repo.remove(id)
  }
}
