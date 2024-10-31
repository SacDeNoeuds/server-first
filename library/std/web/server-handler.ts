import { object } from "../core"
import type { CookieOptions } from "./cookie"
import { HttpError } from "./http-error"
import { MimeType, type MimeTypeOf } from "./mime-type"

// Let's just add what we will use for now.
export type Response =
  | { type: MimeTypeOf<"Html">; body: string }
  | { type: MimeTypeOf<"Png">; body: Blob }
  | { type: MimeTypeOf<"Json">; body: unknown }

export type Redirect = {
  code: 301 | 302
  location: URL
}
export const isRedirect = (value: unknown): value is Redirect => {
  return object.isObject(value) && (value.code === 301 || value.code === 302)
}
export const redirectTo = (location: URL): Redirect => ({
  code: 302,
  location,
})
export const redirectPermanentlyTo = (location: URL): Redirect => ({
  code: 301,
  location,
})

export type HandlerContext = {
  url: URL
  // only 'get' and 'post' are supported when working with HTML forms
  method: "get" | "post"
  /** Route params, for paths like "/users/:id" */
  params: Record<string, string>
  /** To be decoded/parsed individually by each endpoint */
  body: Record<string, unknown> | undefined
  /** get _request_ header */
  getHeader: (name: string) => string | undefined
  /** set _response_ header */
  setHeader: (name: string, value: string) => void
  getCookie: (name: string) => string | undefined
  setCookie: (name: string, value: string, options?: CookieOptions) => void
  /** can be mutated in the handlers */
  setStatus: (code: number) => void
}
export type Handler<Res = Response, AddedContext = {}> = (
  context: HandlerContext & AddedContext,
) => Promise<HttpError | Res | Redirect>

const Handler =
  <T extends MimeType>(type: T) =>
  <C>(
    handler: Handler<(Response & { type: T })["body"], C>,
  ): Handler<Response, C> =>
  async (ctx) => {
    const body = await handler(ctx)
    if (body instanceof HttpError) return body
    if (isRedirect(body)) return body
    return { type, body } as Response
  }

export const HtmlHandler = Handler("Html")
export const PngHandler = Handler("Png")

// a bit more difficult, we want to render to string in the process
export const JsxHandler =
  <Element extends { toString(): string }, C = {}>(
    handler: Handler<Element, C>,
  ): Handler<Response, C> =>
  async (ctx) => {
    const jsx = await handler(ctx)
    if (jsx instanceof HttpError) return jsx
    if (isRedirect(jsx)) return jsx
    return { type: "Html", body: jsx.toString() }
  }

export const JsonHandler = Handler("Json")
