import { GroceryList, GroceryListId } from "./grocery-list"

const make = (parts?: Partial<GroceryList>): GroceryList => ({
  id: GroceryListId.fromString("toto"),
  name: "Le chateau",
  participants: new Set(),
  items: new Map(),
  lastUpdate: new Date(),
  ...parts,
})

const original = make({
  items: new Map([["bread", { quantity: 2 }]]),
})
console.dir(
  {
    original,
    updated: GroceryList.editItem({
      groceryList: original,
      previousName: "bread",
      item: { name: "bread", quantity: 3 },
    }),
    added: GroceryList.addItem({
      groceryList: original,
      item: { name: "butternut", quantity: 10 },
    }),
  },
  { depth: null },
)
