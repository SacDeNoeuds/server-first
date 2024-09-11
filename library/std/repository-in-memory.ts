import type { Repository, RepositoryInit } from "./repository"

export class InMemoryRepository<T> implements Repository<T> {
  readonly store = new Map<string, T>()
  constructor(private options: RepositoryInit<T>) {}

  findById = async (id: string) => {
    return this.store.get(id) ?? undefined
  }

  set = async (item: T) => {
    this.store.set(this.options.mapId(item), item)
  }

  list = async () => {
    return [...this.store.values()]
  }

  remove = async (id: string) => {
    this.store.delete(id)
  }
}
