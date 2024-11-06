import type { UseCasesOf } from "@/std/use-cases"
import { AddGroceryListItem } from "./add-grocery-list-item"
import { CreateGroceryList } from "./create-grocery-list"
import { EditGroceryListItem } from "./edit-grocery-list-item"
import { FindGroceryList } from "./find-grocery-list"
import { JoinGroceryList } from "./join-grocery-list"
import { ListParticipantGroceryLists } from "./list-participant-grocery-lists"
import { RemoveGroceryList } from "./remove-grocery-list"
import { TickGroceryListItem } from "./tick-grocery-list-item"

export const useCases = {
  createGroceryList: CreateGroceryList,
  addGroceryListItem: AddGroceryListItem,
  editGroceryListItem: EditGroceryListItem,
  findGroceryList: FindGroceryList,
  removeGroceryList: RemoveGroceryList,
  joinGroceryList: JoinGroceryList,
  listParticipantGroceryLists: ListParticipantGroceryLists,
  tickGroceryListItem: TickGroceryListItem,
}

export type UseCases = UseCasesOf<typeof useCases>
