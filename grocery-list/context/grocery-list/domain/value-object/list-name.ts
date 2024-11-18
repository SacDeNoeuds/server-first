import { schema as S } from "@/std"
import { valueObject, type branded } from "@/std/branded-types"
import { pipe } from "@/std/core"

export type ListName = branded.Type<string, "ListName">
export const ListName = pipe(
  S.string,
  S.nonEmpty(),
  valueObject.fromSchema<ListName>,
)
