import { schema as S, std, valueObject } from "@/std"

export type ItemQuantity = valueObject.Of<number, "ItemQuantity">
export const ItemQuantity = std.pipe(
  S.number,
  S.greaterThan(0, "QuantityMustBeMoreThan0"),
  valueObject.fromSchema<ItemQuantity>,
)
