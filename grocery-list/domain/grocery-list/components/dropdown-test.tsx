import type { JSX } from "jsx-server/jsx-runtime"

export function DropdownTest(): JSX.JSXElement {
  return (
    <form
      class="column gap-s"
      onsubmit="event.preventDefault(); console.info(new FormData(this))"
    >
      <input
        type="number"
        id="someNumber-control"
        name="someNumber"
        value={42}
        required
      />
      <drop-down close-on-select>
        <div class="form-field">
          <label for="search-control">Search number</label>
          <input
            type="search"
            id="search-control"
            placeholder="search a number"
          />
        </div>
        <div popover class="card column text-left">
          <ButtonOption value={1} />
          <ButtonOption value={2} />
          <ButtonOption value={3} />
          <ButtonOption value={4} />
          <ButtonOption value={5} />
        </div>
      </drop-down>
    </form>
  )
}

interface OptionProps {
  value: number
}
function ButtonOption(props: OptionProps): JSX.JSXElement {
  return (
    <button role="option" data-name="someNumber" data-value={props.value}>
      Number #{props.value}
    </button>
  )
}
