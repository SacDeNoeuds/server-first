import type { UseCasesOf } from "@/std/use-cases"
import { AddGroceryListItemCommand } from "./add-grocery-list-item"
import { CreateGroceryListCommand } from "./create-grocery-list"
import { EditGroceryListItemCommand } from "./edit-grocery-list-item"
import { JoinGroceryListCommand } from "./join-grocery-list"
import { RemoveGroceryListCommand } from "./remove-grocery-list"
import { TickGroceryListItemCommand } from "./tick-grocery-list-item"

export const commands = {
  addGroceryListItem: AddGroceryListItemCommand,
  createGroceryList: CreateGroceryListCommand,
  editGroceryListItem: EditGroceryListItemCommand,
  joinGroceryList: JoinGroceryListCommand,
  removeGroceryList: RemoveGroceryListCommand,
  tickGroceryListItem: TickGroceryListItemCommand,
}

export type Commands = UseCasesOf<typeof commands>
