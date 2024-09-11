import {
  defineEventHandler,
  getCookie,
  getHeader,
  readRawBody,
  sendRedirect,
  serveStatic,
  setCookie,
  setHeader,
  type ServeStaticOptions,
} from "h3"
import { HttpError, NotFound } from "library/std/http-error"
import { MimeType } from "library/std/mime-type"
import { isRedirect, type Handler } from "library/std/server-handler"
import { tryOr } from "library/std/try-or"
import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { parseFormEncodedUrl } from "./parse-form-encoded-url"

function ResponseFromHttpError(error: HttpError) {
  const body = tryOr(
    () => JSON.stringify(error),
    () => JSON.stringify({ message: error.message }),
  )
  return new Response(body, {
    status: error.code,
    headers: { "Content-Type": MimeType.Json },
  })
}

export { createApp, createRouter, toNodeListener } from "h3"

export function staticHandler(
  directory: string,
  options?: Omit<ServeStaticOptions, "getMeta" | "getContents">,
) {
  return defineEventHandler((event) =>
    serveStatic(event, {
      ...options,
      getMeta: async (id) => {
        const stats = await stat(path.join(directory, id))
        if (!stats || !stats.isFile()) return undefined

        return {
          size: stats.size,
          mtime: stats.mtimeMs,
        }
      },
      getContents: (id) => readFile(path.join(directory, id), "utf8"),
    }),
  )
}

export function defineHandler(handler: Handler) {
  return defineEventHandler(async (event) => {
    const method = event.method.toLowerCase()
    if (method !== "get" && method !== "post")
      return ResponseFromHttpError(
        NotFound({ message: `Unsupported method: ${method}` }),
      )

    const result = await handler({
      method,
      url: new URL(
        event.path,
        getHeader(event, "referer") || "http://localhost",
      ),
      params: event.context.params ?? {},
      body:
        method === "post"
          ? parseFormEncodedUrl(await readRawBody(event))
          : undefined,
      getHeader: (name) => getHeader(event, name),
      setHeader: (name, value) => setHeader(event, name, value),
      getCookie: (name) => getCookie(event, name),
      setCookie: (name, value, options) =>
        setCookie(
          event,
          name,
          value,
          options && {
            domain: options.domain,
            httpOnly: options.httpOnly,
            maxAge: options.maxAgeInSeconds,
            path: options.path,
            sameSite: options.sameSite,
            secure: options.secure,
          },
        ),
    })

    if (result instanceof HttpError) return ResponseFromHttpError(result)

    if (isRedirect(result))
      return sendRedirect(event, result.location.href, result.code)

    return new Response(result.body, {
      headers: { "Content-Type": result.type },
    })
  })
}
