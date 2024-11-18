import type {
  GroceryListId,
  ItemName,
  ItemQuantity,
} from "@domain/grocery-list/domain"
import { IntegerInput } from "@shared/http-ui/kit/integer-input"

interface Props {
  id: string
  groceryListId: GroceryListId
  lastGroceryListUpdate: Date
  values?: { name: ItemName; quantity: ItemQuantity }
}
export function GroceryListItemForm(props: Props) {
  const action = props.values ? "edit" : "add"
  return (
    <form
      id={props.id}
      method="post"
      class="column gap-m"
      action={`/${action}-grocery-list-item/${props.groceryListId}`}
    >
      {props.values && (
        <input type="hidden" name="previousName" value={props.values.name} />
      )}
      <input
        type="hidden"
        name="editedVersion"
        value={props.lastGroceryListUpdate.toISOString()}
      />
      <div class="form-field">
        <label for="name-control">Item name</label>
        <input
          type="text"
          id="name-control"
          name="itemName"
          placeholder="Item name"
          value={props.values?.name ?? ""}
          required
        />
      </div>
      <div class="form-field">
        <label for="quantity-control">Quantity</label>
        <IntegerInput
          id="quantity-control"
          name="itemQuantity"
          value={props.values?.quantity ?? 1}
          min={1}
          step={1}
          required
        />
      </div>
    </form>
  )
}
