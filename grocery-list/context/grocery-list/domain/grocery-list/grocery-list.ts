import { std } from "@/std"
import { schema as S } from "@/std/schema"
import { StringId } from "@/std/string-id"
import { authentication } from "@grocery-list/context/authentication"

export type GroceryListId = std.Branded<string, "GroceryListId">
export const GroceryListId = std.BrandedEntity<GroceryListId>("GroceryListId", {
  schema: S.string,
})

export type GroceryListParticipant = authentication.AccountId
export const GroceryListParticipant = authentication.AccountId

export type ListName = std.Branded<string, "ListName">
export const ListName = std.BrandedEntity<ListName>("ListName", {
  schema: S.string,
})

export type ItemName = std.Branded<string, "ItemName">
export const ItemName = std.BrandedEntity<ItemName>("ItemName", {
  schema: S.string,
})
export type ItemQuantity = std.Branded<number, "ItemQuantity">
export const ItemQuantity = std.BrandedEntity<ItemQuantity>("ItemQuantity", {
  schema: S.number,
})

export type GroceryListItem = {
  name: ItemName
  quantity: ItemQuantity
}

export type GroceryListItems = Map<ItemName, Omit<GroceryListItem, "name">>
export const GroceryListItems = S.Map<GroceryListItems>(
  ItemName,
  S.object({ quantity: ItemQuantity }),
)

export type GroceryList = std.Tagged<{
  _tag: "GroceryList"
  id: GroceryListId
  name: ListName
  items: GroceryListItems
  lastUpdate: Date
  participants: Set<GroceryListParticipant>
}>
export const GroceryList = std.TaggedEntity<GroceryList>("GroceryList", {
  id: GroceryListId,
  name: ListName,
  items: GroceryListItems,
  lastUpdate: S.date,
  participants: S.Set(GroceryListParticipant),
})

export const GroceryListApi = {
  create,
  addItem,
  editItem,
  tickItem,
  join,
}

function create(input: {
  name: ListName
  participant: GroceryListParticipant
}): Omit<GroceryList, "lastUpdate"> {
  return GroceryList({
    id: GroceryListId(StringId()),
    items: new Map(),
    name: input.name,
    lastUpdate: new Date(),
    participants: new Set([input.participant]),
  })
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
  previousName: ItemName
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

function tickItem(input: { groceryList: GroceryList; itemName: ItemName }) {
  const nextItems = new Map(input.groceryList.items)
  nextItems.delete(input.itemName)
  const { lastUpdate: _, ...nextGroceryList } = input.groceryList
  return Object.assign(nextGroceryList, { items: nextItems })
}
