import { GroceryList, GroceryListId } from "./entity/grocery-list"
import type { ItemName } from "./entity/item-name"
import type { ItemQuantity } from "./entity/item-quantity"
import type { ListName } from "./entity/list-name"
import type { Participant } from "./entity/participant"

export function create(input: {
  name: ListName
  participant: Participant
}): Omit<GroceryList, "lastUpdate"> {
  return GroceryList({
    id: GroceryListId.new(),
    items: new Map(),
    name: input.name,
    lastUpdate: new Date(),
    participants: new Set([input.participant]),
  })
}

export function addItem(input: {
  groceryList: GroceryList
  name: ItemName
  quantity: ItemQuantity
}): Omit<GroceryList, "lastUpdate"> {
  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  const nextItems = new Map(input.groceryList.items)
  nextItems.set(input.name, { quantity: input.quantity })
  return Object.assign(nextGroceryList, { items: nextItems })
}

export function editItem(input: {
  groceryList: GroceryList
  previousName: ItemName
  name: ItemName
  quantity: ItemQuantity
}): Omit<GroceryList, "lastUpdate"> {
  const nextItems = new Map(input.groceryList.items)
  nextItems.delete(input.previousName)
  nextItems.set(input.name, { quantity: input.quantity })

  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  return Object.assign(nextGroceryList, { items: nextItems })
}

export function join(input: {
  groceryList: GroceryList
  participant: Participant
}): GroceryList {
  const participants = new Set(input.groceryList.participants)
  participants.add(input.participant)
  return { ...input.groceryList, participants }
}

export function tickItem(input: {
  groceryList: GroceryList
  itemName: ItemName
}): Omit<GroceryList, "lastUpdate"> {
  const nextItems = new Map(input.groceryList.items)
  nextItems.delete(input.itemName)
  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  return Object.assign(nextGroceryList, { items: nextItems })
}
