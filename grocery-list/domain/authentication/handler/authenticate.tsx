import { JsxHandler, redirectTo, type Handler } from "@/std/server-handler"
import type { JSX } from "jsx-server/jsx-runtime"
import { Html } from "../../../ui-kit/html"
import { AuthForm } from "../components/auth-form"
import type { Account } from "../entity/account"

export const withAuthWall = (
  handler: Handler<JSX.Child, { account: Account }>,
): Handler =>
  JsxHandler((ctx) => {
    const email = ctx.getCookie("account-id")
    const referrer = ctx.getHeader("referer")
    if (email) return handler({ ...ctx, account: { email } })

    const jsx = (
      <Html>
        <AuthForm redirectTo={referrer} />
      </Html>
    )
    return jsx
  })

export const authenticate = JsxHandler((ctx) => {
  // exceptionally, no need for fancy parsing/decoding considering
  // we have just one property.
  const email = ctx.body?.email
  const hrefOrPath =
    ctx.url.searchParams.get("redirectTo") || ctx.getHeader("referer") || "/"
  const redirectUrl = new URL(hrefOrPath, ctx.getHeader("origin"))

  if (typeof email === "string" && email) {
    ctx.setCookie("account-id", email)
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
