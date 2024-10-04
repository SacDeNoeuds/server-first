import type { DropDownElement } from "./drop-down.js"

declare global {
  interface HTMLElementTagNameMap {
    "drop-down": DropDownElement
  }
}

declare module "jsx-server/jsx-runtime" {
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      /**
			 * @example
			 * ```tsx
			<drop-down
				position="block-end/center|…"
				control-name="someName" optional: when an option is clicked, this control's value will be set with the picked option
			>
				// Any focus-able element
				<button />
				<input />
				<div tabindex={0} />
				preferred way:
				<input type="search" />
				if trigger is an input, the value will be set with the latest picked option (if any)
	
				<div popover>
					an option with attributes role="option" data-value="…"
					Personal suggestion:
					<button role="option" type="button" data-value="option-1">Option #1</button>
	
					Clicking on an option will try setting any parent form element[name].value
					(provided the form & matching input exist)
				</div>
			</drop-down>
			```
			*/
      "drop-down": HTMLAttributes & {
        "close-on-select"?: boolean
        "control-name"?: string
      }
    }
  }
}
