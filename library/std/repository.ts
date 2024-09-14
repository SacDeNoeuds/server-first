export interface Repository<T> {
  findById: (id: string) => Promise<T | undefined>
  set: (id: string, item: T) => Promise<T>
  list: () => Promise<T[]>
  remove: (id: string) => Promise<void>
}
