import { readFile, readdir, rm, writeFile } from "node:fs/promises"
import path from "node:path"
import type { Repository, RepositoryInit } from "./repository"

type Init = {
  directory: string
}

export class FileSystemRepository<T extends Record<string, any>>
  implements Repository<T>
{
  constructor(private options: RepositoryInit<T> & Init) {}

  findById = async (id: string) => {
    const filePath = this.#getFilePath(id)
    const content = await readFile(filePath, "utf-8")
    return content && JSON.parse(content)
  }

  set = async (item: T) => {
    const id = this.options.mapId(item)
    const filePath = this.#getFilePath(id)
    await writeFile(filePath, JSON.stringify(item), "utf-8")
  }

  list = async () => {
    const filePathsWithExt = await readdir(this.options.directory)
    const filePaths = filePathsWithExt.map((filePath) =>
      path.basename(filePath, path.extname(filePath)),
    )
    const promises = filePaths.map(this.findById)
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
