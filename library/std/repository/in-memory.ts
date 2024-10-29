import type { Repository } from "./definition"

export class InMemoryRepository<T> implements Repository<T> {
  readonly store = new Map<string, T>()

  findByKey = async <Key extends keyof T>(key: Key, value: T[Key]) => {
    for (const item of this.store.values()) {
      if (item[key] === value) return item
    }
    return undefined
  }
  findById = async (id: string | String) => {
    return this.store.get(id.valueOf()) ?? undefined
  }

  set = async (id: string | String, item: T): Promise<T> => {
    this.store.set(id.valueOf(), item)
    return item
  }

  list = async () => {
    return [...this.store.values()]
  }

  remove = async (id: string | String) => {
    this.store.delete(id.valueOf())
  }
}
