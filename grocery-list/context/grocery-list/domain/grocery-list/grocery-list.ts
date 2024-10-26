import { StringId } from "@/std/string-id"
import type { Opaque } from "@/std/types"
import type { authentication } from "@grocery-list/context/authentication"

export type GroceryListId = Opaque<string>
export const GroceryListId = {
  fromString: (id: string) => id as GroceryListId,
}

export type GroceryListItems = Map<
  GroceryListItem["name"],
  Omit<GroceryListItem, "name">
>

export type GroceryList = {
  id: GroceryListId
  name: string
  items: GroceryListItems
  lastUpdate: Date
  participants: Set<GroceryListParticipant>
}

export type GroceryListParticipant = authentication.AccountId

export type GroceryListItem = {
  name: string
  quantity: number
}

export const GroceryList = {
  create,
  addItem,
  editItem,
  tickItem,
  join,
}

function create(input: {
  name: string
  participant: GroceryListParticipant
}): Omit<GroceryList, "lastUpdate"> {
  return {
    id: GroceryListId.fromString(StringId()),
    items: new Map(),
    name: input.name,
    participants: new Set([input.participant]),
  }
}

function addItem(input: {
  groceryList: GroceryList
  item: GroceryListItem
}): Omit<GroceryList, "lastUpdate"> {
  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  const nextItems: GroceryListItems = new Map(input.groceryList.items)
  nextItems.set(input.item.name, { quantity: input.item.quantity })
  return Object.assign(nextGroceryList, { items: nextItems })
}

function editItem(input: {
  groceryList: GroceryList
  previousName: string
  item: GroceryListItem
}): Omit<GroceryList, "lastUpdate"> {
  const nextItems = new Map(input.groceryList.items)
  nextItems.delete(input.previousName)
  nextItems.set(input.item.name, { quantity: input.item.quantity })

  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  return Object.assign(nextGroceryList, { items: nextItems })
}

function join(input: {
  groceryList: GroceryList
  participant: authentication.AccountId
}): GroceryList {
  const participants = new Set(input.groceryList.participants)
  participants.add(input.participant)
  return { ...input.groceryList, participants }
}

function tickItem(input: { groceryList: GroceryList; itemName: string }) {
  const nextItems = new Map(input.groceryList.items)
  nextItems.delete(input.itemName)
  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  return Object.assign(nextGroceryList, { items: nextItems })
}
