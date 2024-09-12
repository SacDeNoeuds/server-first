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
export function IntegerInput(props: Props): JSX.JSXElement {
  return (
    <div style="display: inline-flex; gap: 0.25rem; align-items: center;">
      <button
        type="button"
        onclick="this.parentNode.querySelector('input').stepDown()"
      >
        -
      </button>
      <input
        {...props}
        readonly
        type="number"
        step={props.step ?? 1}
        style="border: none; inline-size: 2rem; appearance: textfield; text-align: center;"
      />
      <button
        type="button"
        onclick="this.parentNode.querySelector('input').stepUp()"
      >
        +
      </button>
    </div>
  )
}
