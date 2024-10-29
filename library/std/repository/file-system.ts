import { readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import { json } from "../core"
import { schema as S } from "../schema"
import type { Repository } from "./definition"

type Init<T> = {
  directory: string
  schema: S.Schema<T>
}

export class FileSystemRepository<T extends Record<string, any>>
  implements Repository<T>
{
  constructor(private options: Init<T>) {}

  findById = async (id: string) => {
    const filePath = this.#getFilePath(id)
    const content = await readFile(filePath, "utf-8").catch(() => undefined)
    if (!content) return undefined
    return S.unsafeDecode(json.parse(content), this.options.schema)
  }

  findByKey = async <Key extends keyof T>(key: Key, value: T[Key]) => {
    const items = await this.list()
    return items.find((item) => item[key] === value)
  }

  set = async (id: string, item: T): Promise<T> => {
    const filePath = this.#getFilePath(id)
    await writeFile(filePath, json.stringify(item), "utf-8")
    return item
  }

  list = async () => {
    const filePathsWithExt = await readdir(this.options.directory)
    const filePaths = filePathsWithExt.map((filePath) =>
      path.basename(filePath, path.extname(filePath)),
    )
    const promises = filePaths.map(this.findById) as Promise<T>[]
    return Promise.all(promises)
  }

  remove = async (id: string) => {
    const filePath = this.#getFilePath(id)
    try {
      await rm(filePath)
    } catch {
      console.warn("file", filePath, "did not exist")
    }
  }

  #getFilePath(id: string) {
    return path.join(this.options.directory, id)
  }
}
