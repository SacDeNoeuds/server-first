import type { GroceryListId } from "@domain/grocery-list/domain"
import { IntegerInput } from "@shared/http-ui/kit/integer-input"

interface Props {
  groceryListId: GroceryListId
  lastGroceryListUpdate: Date
  values: {
    quantity: number
    name: string
  }
}
export function QuantityForm(props: Props) {
  return (
    <submit-on-focus-out feedback-delay={2}>
      <form
        class="quantity-form"
        method="post"
        action={`/edit-grocery-list-item/${props.groceryListId}`}
      >
        <input type="hidden" name="previousName" value={props.values.name} />
        <input type="hidden" name="name" value={props.values.name} />
        <input
          type="hidden"
          name="editedVersion"
          value={props.lastGroceryListUpdate.toISOString()}
        />
        <div class="flex gap-xs align-center">
          <div class="flex align-center">
            <span>{"×"}</span>
            <IntegerInput
              id="quantity-control"
              name="quantity"
              min={1}
              step={1}
              value={props.values.quantity}
              required
            />
          </div>
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
