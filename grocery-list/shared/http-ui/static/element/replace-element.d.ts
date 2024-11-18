import type { ReplaceElementElement } from "./replace-element.js"

declare global {
  interface HTMLElementTagNameMap {
    "replace-element": ReplaceElementElement
  }
}

declare module "jsx-server/jsx-runtime" {
  // eslint-disable-next-line
  namespace JSX {
    interface IntrinsicElements {
      /**
       * @example
       * <replace-element target="#my-super-list">
       *   <li>item 1</li>
       *   <li>item 2</li>
       *   <li>item 3</li>
       * </replace-element>
       */
      "replace-element": HTMLAttributes & {
        target: string
      }
    }
  }
}
