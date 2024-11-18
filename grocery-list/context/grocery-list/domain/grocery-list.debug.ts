import * as GroceryListApi from "./aggregate"
import { GroceryList } from "./grocery-list"
import { GroceryListId } from "./value-object/grocery-list-id"
import { ItemName } from "./value-object/item-name"
import { ItemQuantity } from "./value-object/item-quantity"
import { ListName } from "./value-object/list-name"

const make = (parts?: Partial<GroceryList>) => {
  return GroceryList.from({
    id: GroceryListId.new(),
    name: ListName.from("Le chateau"),
    participants: new Set(),
    items: new Map(),
    ...parts,
  })
}

const original = make({
  items: new Map([
    [ItemName.from("bread"), { quantity: ItemQuantity.from(2) }],
  ]),
})
console.dir(
  {
    original,
    updated: GroceryListApi.editItem({
      groceryList: original,
      previousName: ItemName.from("bread"),
      name: ItemName.from("bread"),
      quantity: ItemQuantity.from(3),
    }),
    added: GroceryListApi.addItem({
      groceryList: original,
      name: ItemName.from("butternut"),
      quantity: ItemQuantity.from(10),
    }),
  },
  { depth: null },
)

console.dir(
  {
    decoded: GroceryList.schema.decode({
      _kind: "GroceryList",
      id: "f6s46bshkuj",
      items: new Map(),
      name: "Le Teau-Châ",
      lastUpdate: new Date("2024-10-29T14:10:10.463Z"),
      participants: new Set(["y7oyi3d3kv8"]),
    }),
  },
  { depth: null },
)
