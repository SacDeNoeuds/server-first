import type { JSX } from "jsx-server/jsx-runtime"
import { IntegerInput } from "../../../ui-kit/integer-input"
import type { GroceryList, GroceryListItem } from "../entity/grocery-list"

interface Props {
  id: string
  groceryList: Pick<GroceryList, "id" | "lastUpdate">
  values?: Pick<GroceryListItem, "name" | "quantity">
}
export function GroceryListItemForm(props: Props): JSX.JSXElement {
  const action = props.values ? "edit" : "add"
  return (
    <form
      id={props.id}
      method="post"
      class="column gap-m"
      action={`/${action}-grocery-list-item/${props.groceryList.id}`}
    >
      {props.values && (
        <input type="hidden" name="previousName" value={props.values.name} />
      )}
      <input
        type="hidden"
        name="editedVersion"
        value={props.groceryList.lastUpdate.toISOString()}
      />
      <div class="form-field">
        <label for="name-control">Item name</label>
        <input
          type="text"
          id="name-control"
          name="name"
          placeholder="Item name"
          value={props.values?.name ?? ""}
          required
          minlength={3}
        />
      </div>
      <div class="form-field">
        <label for="quantity-control">Qty</label>
        <IntegerInput
          id="quantity-control"
          name="quantity"
          value={props.values?.quantity ?? 1}
          min={1}
          step={1}
          required
        />
      </div>
    </form>
  )
}
