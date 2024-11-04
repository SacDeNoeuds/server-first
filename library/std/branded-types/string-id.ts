import { pipe } from "../core"
import { lengthOfStringId, StringId } from "../core/functions"
import * as S from "../schema"
import type { Brand } from "./brand"
import { type ValueEntity, fromSchema } from "./entity"

type Shape = Brand<string, any>

export type IdOf<T extends string | number, Tag = symbol> = Brand<T, Tag>

export interface Id<Id extends Shape> extends ValueEntity<Id> {
  new: () => Id
}
export function Id<T extends Shape>() {
  const schema = pipe(
    S.string,
    S.size({
      min: lengthOfStringId,
      max: lengthOfStringId,
      reason: "StringId",
    }),
  )
  const entity = fromSchema(schema)
  return Object.assign(entity, {
    new: StringId as () => T,
  }) as Id<T>
}
