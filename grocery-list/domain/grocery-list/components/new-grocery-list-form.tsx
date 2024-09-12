import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  values?: {
    name: string
  }
  errors?: {
    name?: string
  }
}

export function NewGroceryListForm(props: Props): JSX.JSXElement {
  return (
    <form method="post">
      <div class="form-field">
        <label for="name-control">List name</label>
        <input
          type="text"
          id="name-control"
          name="name"
          placeholder="List name"
          value={props.values?.name ?? ""}
          required
          minlength={3}
        />
        {props.errors?.name && (
          <small class="form-error">{props.errors.name}</small>
        )}
      </div>

      <button type="submit">Go go</button>
    </form>
  )
}
