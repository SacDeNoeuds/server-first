import type { InsertChildrenElement } from "./insert-children"

declare global {
  interface HTMLElementTagNameMap {
    "insert-children": InsertChildrenElement
  }
}

declare module "jsx-server/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * @example
       * <insert-children target="#my-super-list" at={11}>
       *   <li>item 12</li>
       *   <li>item 13</li>
       * </insert-children>
       */
      "insert-children": HTMLAttributes & {
        target: string
        at: number | "start" | "end"
      }
    }
  }
}
