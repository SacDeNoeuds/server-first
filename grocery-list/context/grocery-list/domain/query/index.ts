import type { UseCasesOf } from "@/std"
import { FindGroceryListById } from "./find-grocery-list-by-id"
import { ListParticipantGroceryLists } from "./list-participant-grocery-lists"

export const queries = {
  findGroceryListById: FindGroceryListById,
  listParticipantGroceryLists: ListParticipantGroceryLists,
}

export type Queries = UseCasesOf<typeof queries>
