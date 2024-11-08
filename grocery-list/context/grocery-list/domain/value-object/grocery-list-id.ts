import { valueObjectId } from "@/std"

export type GroceryListId = valueObjectId.Of<string>
export const GroceryListId = valueObjectId.for<GroceryListId>()
