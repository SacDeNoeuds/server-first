import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  groceryListId: string
  index: number
  children?: JSX.Children
}
export function TickGroceryListItemButton(props: Props): JSX.JSXElement {
  const action = `/tick-grocery-list-item/${props.groceryListId}`
  return (
    <form method="post" action={action}>
      <input hidden name="index" value={props.index} />
      <button type="submit">{props.children ?? "✓"}</button>
    </form>
  )
}
