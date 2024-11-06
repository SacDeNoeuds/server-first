import { entity, schema as S, std } from "@/std"

export type ItemQuantity = entity.Value<number, "ItemQuantity">
export const ItemQuantity = std.pipe(
  S.number,
  S.greaterThan(0, "QuantityMustBeMoreThan0"),
  entity.fromSchema<ItemQuantity>,
)
