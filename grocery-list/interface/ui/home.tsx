import { JsxHandler } from "@/std/web/server-handler"
import { Html } from "@shared/ui/kit/html"

const styles = /* css */ `
body {
  padding: 1rem;
}
`.trim()

export const getHomePage = JsxHandler(async (ctx) => {
  return (
    <Html>
      <style>{styles}</style>
      <h1>Welcome to Grocery-List</h1>
      <p>
        This is where you'll find (later on) demos, videos etc. to promote that
        tool.
      </p>
      <a href="/grocery-lists">See your grocery lists</a>
    </Html>
  )
})
