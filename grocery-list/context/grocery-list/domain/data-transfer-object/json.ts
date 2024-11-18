import { schema as S, std } from "@/std"
import { GroceryList, type RawGroceryList } from "../grocery-list"

export type GroceryListJsonTransferObject = {
  id: string
  name: string
  participants: string[]
  items: Record<string, { quantity: number }>
}

const jsonToRaw = (data: GroceryListJsonTransferObject): RawGroceryList => ({
  id: data.id,
  name: data.name,
  items: new Map(Object.entries(data.items)),
  participants: new Set(data.participants),
})
const transferObjectSchema = S.object<GroceryListJsonTransferObject>({
  id: S.string,
  name: S.string,
  items: S.record(S.string, S.object({ quantity: S.number })),
  participants: S.array(S.string),
})
export const GroceryListJson = {
  schema: std.pipe(
    transferObjectSchema,
    S.map(jsonToRaw),
    S.map(std.object.concat({ _tag: "GroceryList" })),
    S.compose(GroceryList.schema),
  ),
  toJson: (data: GroceryList): GroceryListJsonTransferObject => {
    console.info("data", data)
    return {
      id: data.id,
      name: data.name,
      participants: Array.from(data.participants),
      items: Object.fromEntries(data.items.entries()),
    }
  },
  fromJson: (data: GroceryListJsonTransferObject) => {
    return S.unsafeDecode(jsonToRaw(data), GroceryList.schema)
  },
}
