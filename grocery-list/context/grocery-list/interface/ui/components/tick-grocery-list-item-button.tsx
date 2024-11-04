import type { GroceryList } from "@domain/grocery-list/domain/grocery-list"
import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  class?: string
  groceryList: Pick<GroceryList, "id" | "lastUpdate">
  itemName: string
  children?: JSX.Children
}
export function TickGroceryListItemButton(props: Props) {
  const action = `/tick-grocery-list-item/${props.groceryList.id}`
  return (
    <form method="post" action={action}>
      <input type="hidden" name="name" value={props.itemName} />
      <input
        type="hidden"
        name="editedVersion"
        value={props.groceryList.lastUpdate.toISOString()}
      />
      <button class={props.class} type="submit">
        {props.children ?? "✓"}
      </button>
    </form>
  )
}
