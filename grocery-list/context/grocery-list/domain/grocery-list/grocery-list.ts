import { std } from "@/std"
import { EntityValue, type Tagged } from "@/std/branded-types"
import { schema as S } from "@/std/schema"
import { StringId } from "@/std/string-id"
import { authentication } from "@grocery-list/context/authentication"

export type GroceryListId = Tagged<"GroceryListId", string>
export const GroceryListId = EntityValue<GroceryListId>("GroceryListId", {
  schema: S.string,
})

export type GroceryListParticipant = authentication.AccountId
export const GroceryListParticipant = authentication.AccountId

export type ListName = std.Tagged<"ListName", string>
export const ListName = std.EntityValue<ListName>("ListName", {
  schema: S.string,
})

export type ItemName = std.Tagged<"ItemName", string>
export const ItemName = std.EntityValue<ItemName>("ItemName", {
  schema: S.string,
})
export type ItemQuantity = std.Tagged<"ItemQuantity", number>
export const ItemQuantity = std.EntityValue<ItemQuantity>("ItemQuantity", {
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

export type GroceryList = std.Kinded<{
  _kind: "GroceryList"
  id: GroceryListId
  name: ListName
  items: GroceryListItems
  lastUpdate: Date
  participants: Set<GroceryListParticipant>
}>
export const GroceryList = std.EntityObject<GroceryList>("GroceryList", {
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
  hasParticipant,
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

function hasParticipant(
  groceryList: GroceryList,
  participant: GroceryListParticipant,
): boolean {
  return [...groceryList.participants]
    .map((p) => p.valueOf())
    .includes(participant.valueOf())
}
