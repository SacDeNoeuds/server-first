import type { JSX } from "jsx-server/jsx-runtime"
import { IntegerInput } from "../../../ui-kit/integer-input"
import type { GroceryList } from "../entity/grocery-list"

interface Props {
  groceryList: Pick<GroceryList, "id" | "lastUpdate">
  values: {
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
        action={`/edit-grocery-list-item/${props.groceryList.id}`}
      >
        <input type="hidden" name="previousName" value={props.values.name} />
        <input type="hidden" name="name" value={props.values.name} />
        <input
          type="hidden"
          name="editedVersion"
          value={props.groceryList.lastUpdate.toISOString()}
        />
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
