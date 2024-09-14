import type { Repository } from "./repository"

export class InMemoryRepository<T> implements Repository<T> {
  readonly store = new Map<string, T>()

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
