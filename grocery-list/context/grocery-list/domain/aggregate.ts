import { GroceryList } from "./grocery-list"
import { GroceryListId } from "./value-object/grocery-list-id"
import type { ItemName } from "./value-object/item-name"
import type { ItemQuantity } from "./value-object/item-quantity"
import type { ListName } from "./value-object/list-name"
import type { Participant } from "./value-object/participant"

export function createList(input: {
  name: ListName
  participant: Participant
}): Omit<GroceryList, "lastUpdate"> {
  return GroceryList.from({
    id: GroceryListId.new(),
    items: new Map(),
    name: input.name,
    participants: new Set([input.participant]),
  })
}

export function addItem(input: {
  groceryList: GroceryList
  name: ItemName
  quantity: ItemQuantity
}): Omit<GroceryList, "lastUpdate"> {
  const nextItems = new Map(input.groceryList.items)
  nextItems.set(input.name, { quantity: input.quantity })
  return { ...input.groceryList, items: nextItems }
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

  return { ...input.groceryList, items: nextItems }
}

export function addParticipant(input: {
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
  return { ...input.groceryList, items: nextItems }
}
