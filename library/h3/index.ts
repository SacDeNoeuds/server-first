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
import { readFile, stat } from "node:fs/promises"
import path from "node:path"
import { std } from "../std"
import { HttpError, NotFound } from "../std/web/http-error"
import { MimeType, mimeTypeFromExtension } from "../std/web/mime-type"
import {
  isRedirect,
  type Response as HandlerResponse,
  type ServerHandler,
} from "../std/web/server-handler"
import { parseFormEncodedUrl } from "./parse-form-encoded-url"

function ResponseFromHttpError(error: HttpError) {
  const body = std.tryOr(
    () => std.json.stringify(error),
    () => std.json.stringify({ message: error.message }),
  )
  return new Response(body, {
    status: error.code,
    headers: { "Content-Type": MimeType.Json },
  })
}

export { createApp, createRouter, toNodeListener, type Router } from "h3"

export function staticHandler(
  directory: string,
  options?: Omit<ServeStaticOptions, "getMeta" | "getContents">,
) {
  return defineEventHandler((event) => {
    return serveStatic(event, {
      ...options,
      getMeta: async (id) => {
        const stats = await stat(path.join(directory, id))
        if (!stats || !stats.isFile()) return undefined

        const type = mimeTypeFromExtension[path.extname(id)]
        return {
          size: stats.size,
          mtime: stats.mtimeMs,
          ...(type && { type }),
        }
      },
      getContents: (id) => {
        return readFile(path.join(directory, id), "utf8")
      },
    })
  })
}

export type HandlerConfig = {
  protocol: "http" | "https"
}
export function DefineHandler(config: HandlerConfig) {
  return function defineHandler(handler: ServerHandler) {
    return defineEventHandler(async (event) => {
      const method = event.method.toLowerCase()
      if (method !== "get" && method !== "post")
        return ResponseFromHttpError(
          NotFound({ message: `Unsupported method: ${method}` }),
        )

      let statusCode = 200
      try {
        const result = await handler({
          setStatus: (code) => {
            statusCode = code
          },
          method,
          url: new URL(
            event.path,
            getHeader(event, "referer") ||
              getHrefFromHost(config.protocol, getHeader(event, "Host")) ||
              "http://localhost",
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

        if (result instanceof HttpError) {
          console.dir(result, { depth: null })
          return ResponseFromHttpError(result)
        }

        if (isRedirect(result))
          return sendRedirect(event, result.location.href, result.code)

        return new Response(BodyFromHandlerResponse(result), {
          status: statusCode,
          headers: { "Content-Type": result.type },
        })
      } catch (error) {
        if (error instanceof Error) console.error(error.stack)
        throw error
      }
    })
  }
}

function getHrefFromHost(
  protocol: string,
  host: string | undefined,
): string | undefined {
  return host ? `${protocol}://${host}` : undefined
}

function BodyFromHandlerResponse(
  response: HandlerResponse,
): BodyInit | null | undefined {
  switch (response.type) {
    case "Html":
    case "Png":
      return response.body
    case "Json":
      return response.body ? std.json.stringify(response.body) : undefined
  }
}
