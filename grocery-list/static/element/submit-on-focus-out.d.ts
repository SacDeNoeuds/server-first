import "./copy-button"

declare global {
  class SubmitOnFocusOutElement extends HTMLElement {}

  interface HTMLElementTagNameMap {
    "submit-on-focus-out": SubmitOnFocusOutElement
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
       * <submit-on-focus-out feedback-delay={3}>
       *  <form>
       *    …
       *    <span slot="pending">…</span>
       *    <span slot="success">✓</span>
       *  </form>
       * </submit-on-focus-out>
       */
      "submit-on-focus-out": HTMLAttributes & {
        /** In Seconds */
        "feedback-delay": number
      }
    }
  }
}
