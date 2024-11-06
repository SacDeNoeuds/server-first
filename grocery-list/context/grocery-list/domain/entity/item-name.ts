import { entity, schema as S, std } from "@/std"

export type ItemName = entity.Value<string, "ItemName">
export const ItemName = std.pipe(
  S.string,
  S.nonEmpty(),
  entity.fromSchema<ItemName>,
)
