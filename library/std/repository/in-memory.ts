import type { Repository } from "./definition"

export class InMemoryRepository<T> implements Repository<T> {
  readonly store = new Map<string, T>()

  findByKey = async <Key extends keyof T>(key: Key, value: T[Key]) => {
    for (const item of this.store.values()) {
      if (item[key] === value) return item
    }
    return undefined
  }
  findById = async (id: string) => {
    return this.store.get(id) ?? undefined
  }

  set = async (id: string, item: T): Promise<T> => {
    this.store.set(id, item)
    return item
  }

  list = async () => {
    return [...this.store.values()]
  }

  remove = async (id: string) => {
    this.store.delete(id)
  }
}
