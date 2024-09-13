export type GroceryList = {
  id: string
  name: string
  items: GroceryListItem[]
}

export type GroceryListItem = {
  name: string
  quantity: number
}
