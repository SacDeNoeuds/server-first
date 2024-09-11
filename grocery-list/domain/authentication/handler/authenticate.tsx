import { Html } from "grocery-list/ui-kit/html"
import type { JSX } from "jsx-server/jsx-runtime"
import {
  JsxHandler,
  redirectTo,
  type Handler,
} from "library/std/server-handler"
import { AuthForm } from "../components/auth-form"
import type { Account } from "../entity/account"

export const withAuthWall = (
  handler: Handler<JSX.Child, { account: Account }>,
): Handler =>
  JsxHandler((params) => {
    const email = params.getCookie("account-id")
    const referrer = params.getHeader("referer")
    if (email) return handler({ ...params, account: { email } })

    const jsx = (
      <Html>
        <AuthForm redirectTo={referrer} />
      </Html>
    )
    return jsx
  })

export const authenticate = JsxHandler((params) => {
  // exceptionally, no need for fancy parsing/decoding considering
  // we have just one property.
  const email = params.body?.email
  const hrefOrPath =
    params.url.searchParams.get("redirectTo") ||
    params.getHeader("referer") ||
    "/"
  const redirectUrl = new URL(hrefOrPath, params.getHeader("origin"))

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
