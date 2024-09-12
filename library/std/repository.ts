export type RepositoryInit<T> = {
  mapId: (item: T) => string
}

export interface Repository<T> {
  findById: (id: string) => Promise<T | undefined>
  set: (item: T) => Promise<void>
  list: () => Promise<T[]>
  remove: (id: string) => Promise<void>
}