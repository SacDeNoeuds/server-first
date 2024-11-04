import * as GroceryListApi from "./behavior"
import {
  GroceryList,
  GroceryListId,
  ItemName,
  ItemQuantity,
  ListName,
} from "./grocery-list"

const make = (parts?: Partial<GroceryList>) =>
  GroceryList({
    id: GroceryListId("toto"),
    name: ListName("Le chateau"),
    participants: new Set(),
    items: new Map(),
    lastUpdate: new Date(),
    ...parts,
  })

const original = make({
  items: new Map([[ItemName("bread"), { quantity: ItemQuantity(2) }]]),
})
console.dir(
  {
    original,
    updated: GroceryListApi.editItem({
      groceryList: original,
      previousName: ItemName("bread"),
      name: ItemName("bread"),
      quantity: ItemQuantity(3),
    }),
    added: GroceryListApi.addItem({
      groceryList: original,
      name: ItemName("butternut"),
      quantity: ItemQuantity(10),
    }),
  },
  { depth: null },
)

console.dir(
  {
    decoded: GroceryList.decode({
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
