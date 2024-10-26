import type { JSX } from "jsx-server/jsx-runtime"

interface Props {
  id: string
  name: string
  value?: number
  min?: number
  max?: number
  step?: number
  required?: boolean
}
export function IntegerInput(props: Props): JSX.Html {
  return (
    <div class="inline-flex gap-xs align-center">
      <input
        {...props}
        readonly
        tabindex={-1}
        type="number"
        step={props.step ?? 1}
        style="border: none; inline-size: 2em; appearance: textfield; padding: 0"
      />
      <button
        type="button"
        onclick="this.parentNode.querySelector('input').stepDown()"
      >
        -
      </button>
      <button
        type="button"
        onclick="this.parentNode.querySelector('input').stepUp()"
      >
        +
      </button>
    </div>
  )
}
