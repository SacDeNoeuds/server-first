import { schema as S, std } from "@/std"
import { valueObject, type branded } from "@/std/branded-types"

export type ItemQuantity = branded.Type<number, "ItemQuantity">
export const ItemQuantity = std.pipe(
  S.number,
  S.greaterThan(0, "QuantityMustBeMoreThan0"),
  valueObject.fromSchema<ItemQuantity>,
)
