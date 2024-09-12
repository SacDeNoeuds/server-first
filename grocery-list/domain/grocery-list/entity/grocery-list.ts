import type { Account } from "../../authentication/entity/account"

export type GroceryList = {
  id: string
  name: string
  peers: Account["email"][] // or collaborators
  items: GroceryListItem[]
}

export type GroceryListItem = {
  name: string
  quantity: number
}
