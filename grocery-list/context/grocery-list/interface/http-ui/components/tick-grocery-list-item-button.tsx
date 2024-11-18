import type { GroceryListId } from "@domain/grocery-list/domain"
import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  class?: string
  groceryListId: GroceryListId
  lastGroceryListUpdate: Date
  itemName: string
  children?: JSX.Children
}
export function TickGroceryListItemButton(props: Props) {
  const action = `/tick-grocery-list-item/${props.groceryListId}`
  return (
    <form method="post" action={action}>
      <input type="hidden" name="name" value={props.itemName} />
      <input
        type="hidden"
        name="editedVersion"
        value={props.lastGroceryListUpdate.toISOString()}
      />
      <button class={props.class} type="submit">
        {props.children ?? "✓"}
      </button>
    </form>
  )
}
