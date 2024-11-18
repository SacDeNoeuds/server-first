import { entity, schema as S } from "@/std"
import { GroceryListId } from "./value-object/grocery-list-id"
import { ItemName } from "./value-object/item-name"
import { ItemQuantity } from "./value-object/item-quantity"
import { ListName } from "./value-object/list-name"
import { Participant } from "./value-object/participant"

export type RawGroceryList = {
  id: string
  name: string
  participants: Set<string>
  items: Map<string, { quantity: number }>
}

type Entity = entity.Object<{
  _tag: "GroceryList"
  id: GroceryListId
  name: ListName
  participants: Set<Participant>
  items: Map<ItemName, { quantity: ItemQuantity }>
}>
export type GroceryList = entity.Satisfies<RawGroceryList, Entity>

export const GroceryList = entity.object<GroceryList>("GroceryList", {
  id: GroceryListId.schema,
  name: ListName.schema,
  participants: S.Set(Participant.schema),
  items: S.Map(ItemName.schema, S.object({ quantity: ItemQuantity.schema })),
})
