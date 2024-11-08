import { schema as S, valueObject } from "@/std"
import { pipe } from "@/std/core"

export type ListName = valueObject.Of<string, "ListName">
export const ListName = pipe(
  S.string,
  S.nonEmpty(),
  valueObject.fromSchema<ListName>,
)
