import { Html } from "grocery-list/ui-kit/html"
import { JsxHandler } from "library/std/server-handler"

const styles = /* css */ `
body {
  padding: 1rem;
}
`.trim()

export const getHome = JsxHandler(async (params) => {
  return (
    <Html>
      <style>{styles}</style>
      <h1>Welcome to Grocery-List</h1>
      <p>
        This is where you'll find (later on) demos, videos etc. to promote that
        tool.
      </p>
    </Html>
  )
})
