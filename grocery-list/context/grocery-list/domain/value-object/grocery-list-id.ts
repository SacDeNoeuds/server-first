import type { branded } from "@/std/branded-types"
import { StringId } from "@/std/branded-types/id"

export type GroceryListId = branded.Type<string, "GroceryListId">
export const GroceryListId = StringId<GroceryListId>()
