import type { ComponentProps, JSX } from "jsx-server/jsx-runtime"
import { GroceryListItemForm } from "./grocery-list-item-form"

type FormProps = Pick<
  ComponentProps<typeof GroceryListItemForm>,
  "groceryListId" | "values"
>
interface Props extends FormProps {
  class?: string
  children: JSX.Children
}

export function GroceryListItemFormModal(props: Props): JSX.JSXElement {
  const baseId = props.values ? `edit-item-${props.values.index}` : "add-item"
  const formId = `${baseId}-form`
  const popoverId = `${baseId}-popover`
  return (
    <>
      <button
        type="button"
        class={props.class}
        popovertarget={popoverId}
        popovertargetaction="show"
      >
        {props.children}
      </button>
      <dialog popover id={popoverId}>
        <main>
          <GroceryListItemForm
            id={formId}
            groceryListId={props.groceryListId}
            values={props.values}
          />
        </main>

        <footer>
          <button popovertarget={popoverId} popovertargetaction="hide">
            Close
          </button>
          <button form={formId}>Save</button>
        </footer>
      </dialog>
    </>
  )
}