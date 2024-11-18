import { schema as S, std } from "@/std"
import { valueObject, type branded } from "@/std/branded-types"

export type ItemName = branded.Type<string, "ItemName">
export const ItemName = std.pipe(
  S.string,
  S.nonEmpty(),
  valueObject.fromSchema<ItemName>,
)
