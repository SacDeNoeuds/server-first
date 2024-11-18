import { schema as S, type Repository } from "../std"
import { computePatch, type DiffAble } from "./compute-patch"
import {
  addHistoryEntry,
  reconstructFromHistory,
  type JsonPatchHistory,
} from "./history"
import { separateFailingOperations } from "./separate-failing-operations"

type Options<T, Encoded> = {
  repo: Repository<JsonPatchHistory>
  schema: S.Schema<T>
  encode: (value: T) => Encoded
}

export class JsonPatchRepository<T extends object, Encoded extends DiffAble> {
  private repo: Options<T, Encoded>["repo"]
  private schema: Options<T, Encoded>["schema"]
  private encode: Options<T, Encoded>["encode"]
  constructor(options: Options<T, Encoded>) {
    this.repo = options.repo
    this.schema = options.schema
    this.encode = options.encode
  }

  #reconstruct = (
    history: JsonPatchHistory,
  ): { value: T; lastUpdate: Date } | undefined => {
    const lastUpdate = history?.at(-1)?.date
    if (!lastUpdate) return undefined
    const value = reconstructFromHistory<T>(history)
    return (
      value && {
        value: S.unsafeDecode(value, this.schema),
        lastUpdate,
      }
    )
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
    return history
      ? this.#updateItem({ author, editedVersion, id, nextValue, history })
      : this.#createItem(author, id, nextValue)
  }

  #createItem = async (author: string, id: string, nextValue: T) => {
    const encoded = this.encode(nextValue)
    const patch = computePatch(undefined, encoded)
    const entry: JsonPatchHistory[number] = {
      author,
      date: new Date(),
      patch,
    }
    await this.repo.set(id, [entry])
    return nextValue
  }

  #updateItem = async (options: {
    author: string
    editedVersion: Date
    nextValue: T
    id: string
    history: JsonPatchHistory
  }): Promise<T> => {
    const { author, editedVersion, id, nextValue, history } = options
    const previousValue = reconstructFromHistory(history, {
      until: editedVersion,
    })
    const latestValue = reconstructFromHistory(history)!
    // some operations may be duplicates.
    const safePatch = separateFailingOperations(
      latestValue as object,
      computePatch(previousValue as DiffAble, this.encode(nextValue)),
    )
    if (safePatch.invalid.length > 0)
      console.warn("invalid operations:", safePatch.invalid)
    if (safePatch.valid.length === 0)
      return S.unsafeDecode(latestValue, this.schema) // no-op

    const nextHistory = addHistoryEntry(history, {
      patch: safePatch.valid,
      author,
      date: new Date(),
    })

    const reconstructed = reconstructFromHistory(nextHistory)!
    // in case `reconstructFromHistory` throws, corrupt data isn't stored.
    await this.repo.set(id, nextHistory)
    return S.unsafeDecode(reconstructed, this.schema)
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
