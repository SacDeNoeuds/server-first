import type {
  GroceryList,
  GroceryListItem,
} from "@grocery-list/context/grocery-list/domain/grocery-list"
import { IntegerInput } from "@grocery-list/shared/ui/kit/integer-input"

interface Props {
  id: string
  groceryList: Pick<GroceryList, "id" | "lastUpdate">
  values?: Pick<GroceryListItem, "name" | "quantity">
}
export function GroceryListItemForm(props: Props) {
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
        <label for="quantity-control">Quantity</label>
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
