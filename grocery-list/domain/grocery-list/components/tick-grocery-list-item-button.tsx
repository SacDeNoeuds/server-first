import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  class?: string
  groceryListId: string
  itemName: string
  children?: JSX.Children
}
export function TickGroceryListItemButton(props: Props): JSX.JSXElement {
  const action = `/tick-grocery-list-item/${props.groceryListId}`
  return (
    <form method="post" action={action}>
      <input type="hidden" name="name" value={props.itemName} />
      <input type="hidden" name="at" value={new Date().toISOString()} />
      <button class={props.class} type="submit">
        {props.children ?? "✓"}
      </button>
    </form>
  )
}
