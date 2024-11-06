import { entity, schema as S } from "@/std"
import { pipe } from "@/std/core"

export type ListName = entity.Value<string, "ListName">
export const ListName = pipe(
  S.string,
  S.nonEmpty(),
  entity.fromSchema<ListName>,
)
