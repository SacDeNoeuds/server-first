import type { JSX as ServerJSX } from "../library/jsx-server/jsx-runtime"

declare global {
  namespace JSX {
    interface IntrinsicElements extends ServerJSX.IntrinsicElements {}
    interface IntrinsicAttributes extends ServerJSX.IntrinsicAttributes {}
    interface HTMLAttributes extends ServerJSX.HTMLAttributes {}
    export type Element = ServerJSX.Element
    export type Children = ServerJSX.Children
  }
}
