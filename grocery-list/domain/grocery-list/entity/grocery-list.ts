export type GroceryList = {
  id: string
  name: string
  items: Record<GroceryListItem["name"], Omit<GroceryListItem, "name">>
  lastUpdate: Date
}

export type GroceryListItem = {
  name: string
  quantity: number
}
