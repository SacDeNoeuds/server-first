import { Html } from "grocery-list/ui-kit/html"
import type { JSX } from "jsx-server/jsx-runtime"
import {
  JsxHandler,
  redirectTo,
  type Handler,
} from "library/std/server-handler"
import { AuthForm } from "../components/auth-form"

export const withAuthWall = (handler: Handler<JSX.Child>): Handler =>
  JsxHandler((params) => {
    const email = params.getCookie("account-id")
    const referrer = params.getHeader("referer")
    console.debug("withAuthWall", { email })
    if (email) return handler(params)

    const jsx = (
      <Html>
        <AuthForm redirectTo={referrer} />
      </Html>
    )
    return jsx
  })

export const authenticate = JsxHandler((params) => {
  const email = params.body?.get("email")
  const hrefOrPath =
    params.url.searchParams.get("redirectTo") ||
    params.getHeader("referer") ||
    "/"
  const redirectUrl = new URL(hrefOrPath, params.getHeader("origin"))
  console.debug("authenticate", params, {
    email,
    redirectUrl,
  })

  if (typeof email === "string" && email) {
    params.setCookie("account-id", email)
    return redirectTo(redirectUrl)
  }
  return (
    <Html>
      <AuthForm
        redirectTo={redirectUrl.href}
        errors={{
          email: email
            ? `Email "${email}" is invalid`
            : "Please provide an email",
        }}
      />
    </Html>
  )
})
