export interface Repository<T> {
  findById: (id: string | String) => Promise<T | undefined>
  findByKey: <Key extends keyof T>(
    key: Key,
    value: T[Key],
  ) => Promise<T | undefined>
  set: (id: string | String, item: T) => Promise<T>
  list: () => Promise<T[]>
  remove: (id: string | String) => Promise<void>
}
