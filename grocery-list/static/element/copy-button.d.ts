import "./copy-button"

declare global {
  class CopyButtonElement extends HTMLElement {
    get copyTarget(): HTMLElement | null
    copyTextOfTarget: () => void
  }

  interface HTMLElementTagNameMap {
    "copy-button": CopyButtonElement
  }
}

declare module "jsx-server/jsx-runtime" {
  // eslint-disable-next-line
  namespace JSX {
    // That's how you fully provide the custom element's attributes, including ones
    // from HTML.
    interface IntrinsicElements {
      /**
       * @example
       * <copy-button copy-target="input#join-url">
       *  <button type="button">Copy</button>
       * </copy-button>
       */
      "copy-button": HTMLAttributes & {
        "copy-target": string
      }
    }
  }
}
