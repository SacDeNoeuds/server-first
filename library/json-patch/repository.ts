import { schema as S, std, type Repository } from "../std"
import { computePatch, type DiffAble } from "./compute-patch"
import {
  addHistoryEntry,
  reconstructFromHistory,
  type JsonPatchHistory,
} from "./history"
import { separateFailingOperations } from "./separate-failing-operations"

type Options<T> = {
  repo: Repository<JsonPatchHistory>
  schema: S.Schema<T>
}

type UnRevivedHistory = Array<
  Omit<JsonPatchHistory[number], "date"> & { date: string }
>
const toRevivedHistory = (unRevived: UnRevivedHistory): JsonPatchHistory => {
  return unRevived.map((h) => ({ ...h, date: new Date(h.date) }))
}

export class JsonPatchRepository<T extends object> {
  private repo: Options<T>["repo"]
  private schema: Options<T>["schema"]
  constructor(options: Options<T>) {
    this.repo = options.repo
    this.schema = options.schema
  }

  #reconstruct = (
    history: UnRevivedHistory,
  ): { value: T; lastUpdate: Date } | undefined => {
    const lastUpdate = history?.at(-1)?.date
    if (!lastUpdate) return undefined
    const value = reconstructFromHistory<T>(toRevivedHistory(history))
    const revived = value && std.json.toRevived<T, T>(value)
    return (
      revived && {
        value: S.unsafeDecode(revived, this.schema),
        lastUpdate: new Date(lastUpdate),
      }
    )
  }

  async #getUnRevivedHistory(id: string) {
    const history = await this.repo.findById(id)
    return (
      history &&
      std.json.toUnRevived<JsonPatchHistory, UnRevivedHistory>(history)
    )
  }

  findById = async (
    id: string,
  ): Promise<{ value: T; lastUpdate: Date } | undefined> => {
    const history = await this.#getUnRevivedHistory(id)
    return history && this.#reconstruct(history)
  }

  set = async (
    author: string,
    editedVersion: Date,
    id: string,
    nextValue: T,
  ): Promise<T> => {
    const history = await this.#getUnRevivedHistory(id)
    if (!history) {
      const patch = computePatch(undefined, std.json.toUnRevived(nextValue))
      const newHistory: JsonPatchHistory[number] = {
        author,
        date: new Date(),
        patch,
      }
      await this.repo.set(id, [newHistory])
      return nextValue
    }

    const previousValue = reconstructFromHistory<T>(toRevivedHistory(history), {
      until: editedVersion,
    })
    const latestValue = reconstructFromHistory<T>(
      toRevivedHistory(history),
    ) as T
    // some operations may be duplicates.
    const safePatch = separateFailingOperations(
      std.json.toUnRevived<T, object>(latestValue),
      computePatch(
        previousValue && std.json.toUnRevived<T, DiffAble>(previousValue),
        std.json.toUnRevived<T, DiffAble>(nextValue),
      ),
    )
    if (safePatch.invalid.length > 0)
      console.warn("invalid operations:", safePatch.invalid)
    if (safePatch.valid.length === 0) return latestValue // no-op

    const nextHistory = addHistoryEntry(toRevivedHistory(history), {
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
    return histories
      .map(std.json.toUnRevived<JsonPatchHistory, UnRevivedHistory>)
      .map(this.#reconstruct)
      .filter(isDefined)
  }

  remove = async (id: string): Promise<void> => {
    await this.repo.remove(id)
  }
}
