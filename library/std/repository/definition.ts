export interface Repository<T> {
  findById: (id: string) => Promise<T | undefined>
  findByKey: <Key extends keyof T>(
    key: Key,
    value: T[Key],
  ) => Promise<T | undefined>
  set: (id: string, item: T) => Promise<T>
  list: () => Promise<T[]>
  remove: (id: string) => Promise<void>
}
