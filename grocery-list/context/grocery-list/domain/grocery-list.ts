import { entity, schema as S } from "@/std"
import { GroceryListId } from "./value-object/grocery-list-id"
import { ItemName } from "./value-object/item-name"
import { ItemQuantity } from "./value-object/item-quantity"
import { ListName } from "./value-object/list-name"
import { Participant } from "./value-object/participant"

export type GroceryList = entity.Of<{
  _tag: "GroceryList"
  id: GroceryListId
  name: ListName
  participants: Set<Participant>
  items: Map<ItemName, { quantity: ItemQuantity }>
  lastUpdate: Date
}>

export const GroceryList = entity.for<GroceryList>("GroceryList", {
  id: GroceryListId,
  name: ListName,
  participants: S.Set(Participant),
  items: S.Map(ItemName, S.object({ quantity: ItemQuantity })),
  lastUpdate: S.date,
})
