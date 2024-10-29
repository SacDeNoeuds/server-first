import assert from "assert"
import { JsxHandler, redirectTo, type HandlerContext } from "./server-handler"

async function test() {
  const handler = JsxHandler(async (params) => {
    if (params.method === "post")
      return redirectTo(new URL("http://localhost:3000/redirection"))

    return <div>Hello !</div>
  })
  const mockParams = (method: "get" | "post"): HandlerContext => ({
    method,
    url: new URL("http://localhost:3000"),
    body: undefined,
    getHeader: () => undefined,
    setHeader: () => {},
    getCookie: () => undefined,
    setCookie: () => {},
    params: {},
    setStatus: () => {},
  })
  const resultOfGet = await handler(mockParams("get"))
  assert.deepStrictEqual(resultOfGet, {
    type: "text/html",
    body: "<div>Hello !</div>",
  })

  const resultOfPost = await handler(mockParams("post"))
  assert.deepStrictEqual(resultOfPost, {
    code: 302,
    location: new URL("http://localhost:3000/redirection"),
  })

  console.info("all good ✅")
}

test().catch(console.error)
