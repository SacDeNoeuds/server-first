import { pipe } from "../core"
import { StringId } from "../core/functions"
import * as S from "../schema"
import type { Brand } from "./brand"
import { fromSchema, type ValueObject } from "./value-object"

type Shape = Brand<string, any>

export type Of<T extends string | number, Tag = symbol> = Brand<T, Tag>

export interface Id<Id extends Shape> extends ValueObject<Id> {
  new: () => Id
}

export { Id as for }
function Id<T extends Shape>() {
  const schema = pipe(
    S.string,
    S.size({
      min: 6,
      max: 12,
      reason: "StringId",
    }),
  )
  const entity = fromSchema(schema)
  return Object.assign(entity, {
    new: StringId as () => T,
  }) as Id<T>
}
