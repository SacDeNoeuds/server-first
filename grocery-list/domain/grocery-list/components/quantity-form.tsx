import type { JSX } from "jsx-server/jsx-runtime"
import { IntegerInput } from "../../../ui-kit/integer-input"

interface Props {
  groceryListId: string
  values: {
    index: number
    quantity: number
    name: string
  }
}
export function QuantityForm(props: Props): JSX.JSXElement {
  return (
    <submit-on-focus-out feedback-delay={2}>
      <form
        class="quantity-form"
        method="post"
        action={`/edit-grocery-list-item/${props.groceryListId}`}
      >
        <input hidden name="index" value={props.values.index} />
        <input hidden name="name" value={props.values.name} />
        <div class="flex align-center">
          {"×"}
          <IntegerInput
            id="quantity-control"
            name="quantity"
            min={1}
            step={1}
            value={props.values.quantity}
            required
          />
          <span hidden slot="pending">
            …
          </span>
          <span hidden slot="success">
            ✓
          </span>
        </div>
      </form>
    </submit-on-focus-out>
  )
}

const css = /* css */ `
.quantity-form {
  & [name="quantity-control"] {

  }
}
`
