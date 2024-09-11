import type { JSX } from "jsx-server/jsx-runtime"
import { renderToString } from "jsx-server/render-to-string"
import { HttpError } from "./http-error"
import { isObject } from "./is-object"
import { MimeType } from "./mime-type"

// Let's just add what we will use for now.
export type Response =
  | { type: MimeType.Html; body: string }
  | { type: MimeType.Png; body: Blob }

export type Redirect = {
  code: 301 | 302
  location: URL
}
export const isRedirect = (value: unknown): value is Redirect => {
  return isObject(value) && (value.code === 301 || value.code === 302)
}
export const redirectTo = (location: URL): Redirect => ({
  code: 302,
  location,
})
export const redirectPermanentlyTo = (location: URL): Redirect => ({
  code: 301,
  location,
})

export type HandlerParams = {
  url: URL
  // only 'get' and 'post' are supported when working with HTML forms
  method: "get" | "post"
  /** Route params, for paths like "/users/:id" */
  params: Record<string, string>
  body: URLSearchParams | undefined
  /** get _request_ header */
  getHeader: (name: string) => string | undefined
  /** set _response_ header */
  setHeader: (name: string, value: string) => void
}
export type Handler<Res = Response> = (
  params: HandlerParams,
) => Promise<HttpError | Res | Redirect>

const Handler =
  <T extends MimeType>(type: T) =>
  (handler: Handler<(Response & { type: T })["body"]>): Handler =>
  async (params) => {
    const body = await handler(params)
    if (body instanceof HttpError) return body
    if (isRedirect(body)) return body
    return { type, body } as Response
  }

export const HtmlHandler = Handler(MimeType.Html)
export const PngHandler = Handler(MimeType.Png)

// a bit more difficult, we want to render to string in the process
export const JsxHandler =
  (handler: Handler<JSX.Child>): Handler =>
  async (params) => {
    const jsx = await handler(params)
    if (jsx instanceof HttpError) return jsx
    if (isRedirect(jsx)) return jsx
    return { type: MimeType.Html, body: renderToString(jsx) }
  }
