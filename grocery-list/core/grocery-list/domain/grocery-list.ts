import { entity, schema as S, std } from "@/std"

export type GroceryList = entity.Object<{
  _tag: "GroceryList"
  id: GroceryListId
  name: ListName
  participants: Set<Participant>
  items: Map<ItemName, { quantity: ItemQuantity }>
  lastUpdate: Date
}>
export type GroceryListId = entity.IdOf<string>
export type ListName = entity.OfType<string>
export type Participant = entity.OfType<string>
export type ItemName = entity.OfType<string>
export type ItemQuantity = entity.OfType<number>

// --- Schemas ---
export const GroceryListId = entity.Id<GroceryListId>()
export const Participant = entity.fromSchema<Participant>(S.string)
export const ListName = std.pipe(
  S.string,
  S.nonEmpty(),
  entity.fromSchema<ListName>,
)
export const ItemName = std.pipe(
  S.string,
  S.nonEmpty(),
  entity.fromSchema<ItemName>,
)
export const ItemQuantity = std.pipe(
  S.number,
  S.greaterThan(0, "QuantityMustBeMoreThan1"),
  entity.fromSchema<ItemQuantity>,
)

export const GroceryList = entity.Object<GroceryList>("GroceryList", {
  id: GroceryListId,
  name: ListName,
  participants: S.Set(Participant),
  items: S.Map(ItemName, S.object({ quantity: ItemQuantity })),
  lastUpdate: S.date,
})
