import { pipe } from "../core"
import { lengthOfStringId, StringId } from "../core/functions"
import { schema as S } from "../schema"
import type { Brand } from "./brand"
import { type ValueEntity, fromSchema } from "./entity"

type Shape = Brand<string, any>

export type Id<T extends string | number, Tag = symbol> = Brand<T, Tag>

export interface IdFor<Id extends Shape> extends ValueEntity<Id> {
  new: () => Id
}
export function IdFor<T extends Shape>() {
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
  }) as IdFor<T>
}
