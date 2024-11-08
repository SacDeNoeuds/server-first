import { schema as S, std, valueObject } from "@/std"

export type ItemName = valueObject.Of<string, "ItemName">
export const ItemName = std.pipe(
  S.string,
  S.nonEmpty(),
  valueObject.fromSchema<ItemName>,
)
