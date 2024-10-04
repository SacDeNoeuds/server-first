import type { RemoteHtmlElement } from "./remote-html.js"

declare global {
  interface HTMLElementTagNameMap {
    "remote-html": RemoteHtmlElement
  }
}

declare module "jsx-server/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      /**
       * @example
       * <remote-html
       *   endpoint="/demo/path"
       *   endpoint="https://example.com/test"
       *   search-targets="name=name-control&age=age-control" (optional)
       *   param-targets="id=id-control&name=name-control" if path like "/path/:id/:name"
       *   hidden (optional)
       *   base-path="/api" (optional)
       * >
       *   <a-loader when-is="pending" hidden />
       *   or
       *   <template when-is="pending">
       *     <a-loader progress="[percent]" />
       *   </template>
       *   <template when-is="failure">
       *     <a-toast>[error]</a-toast>
       *   </template>
       *   <div when-is="success" (class="pending") />
       * </remote-html>
       */
      "remote-html": HTMLAttributes & {
        endpoint: string
        "search-targets"?: string
        "param-targets"?: string
        "trigger-fetch-on"?: "blur" | "input" | "change"
        // "debounce-in-ms"?: number;
      }
    }
  }
}
