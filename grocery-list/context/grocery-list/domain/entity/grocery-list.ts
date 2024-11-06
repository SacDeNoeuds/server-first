import { entity, schema as S } from "@/std"
import { ItemName } from "./item-name"
import { ItemQuantity } from "./item-quantity"
import { ListName } from "./list-name"
import { Participant } from "./participant"

export type GroceryList = entity.Object<{
  _tag: "GroceryList"
  id: GroceryListId
  name: ListName
  participants: Set<Participant>
  items: Map<ItemName, { quantity: ItemQuantity }>
  lastUpdate: Date
}>
export type GroceryListId = entity.IdOf<string>

// --- Schemas ---
export const GroceryListId = entity.Id<GroceryListId>()

export const GroceryList = entity.Object<GroceryList>("GroceryList", {
  id: GroceryListId,
  name: ListName,
  participants: S.Set(Participant),
  items: S.Map(ItemName, S.object({ quantity: ItemQuantity })),
  lastUpdate: S.date,
})
