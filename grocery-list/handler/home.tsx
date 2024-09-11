import { Html } from "grocery-list/ui-kit/html"
import { JsxHandler } from "library/std/server-handler"

export const getHome = JsxHandler(async (params) => {
  return (
    <Html>
      <div>Hello World – nice to meet you!</div>
      <div>Referrer: {params.getHeader("referer") ?? "None"}</div>
    </Html>
  )
})
