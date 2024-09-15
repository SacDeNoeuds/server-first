import type { ComponentProps, JSX } from "jsx-server/jsx-runtime"
import { GroceryListItemForm } from "./grocery-list-item-form"

type FormProps = Pick<
  ComponentProps<typeof GroceryListItemForm>,
  "groceryList" | "values"
>
interface Props extends FormProps {
  class?: string
  children: JSX.Children
}

export function GroceryListItemFormModal(props: Props): JSX.JSXElement {
  const slugify = (str: string) => str.toLowerCase().replaceAll(" ", "-").trim()
  const baseId = props.values
    ? `edit-item-${slugify(props.values.name)}`
    : "add-item"
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
        <header>
          <h3>{props.values ? "Edit item" : "Add item"}</h3>
        </header>
        <main>
          <GroceryListItemForm
            id={formId}
            groceryList={props.groceryList}
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
