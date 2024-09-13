import { JsxHandler, redirectTo, type Handler } from "@/std/server-handler"
import type { JSX } from "jsx-server/jsx-runtime"
import { getInfra } from "../../../infra/infra"
import { AuthForm } from "../components/auth-form"
import { AuthPage } from "../components/auth-page"
import type { Account } from "../entity/account"

export const withAuthWall = (
  handler: Handler<JSX.Child, { account: Account }>,
): Handler =>
  JsxHandler(async (ctx) => {
    const email = ctx.getCookie("account-id")
    const referrer = ctx.getHeader("referer")
    const { repository } = getInfra()
    const account = email && (await repository.account.findByEmail(email))
    if (account) return handler({ ...ctx, account })

    return (
      <AuthPage>
        <AuthForm redirectTo={referrer} />
      </AuthPage>
    )
  })

export const authenticate = JsxHandler(async (ctx) => {
  // exceptionally, no need for fancy parsing/decoding considering
  // we have just one property.
  const email = ctx.body?.email
  const hrefOrPath =
    ctx.url.searchParams.get("redirectTo") || ctx.getHeader("referer") || "/"
  const redirectUrl = new URL(hrefOrPath, ctx.url)

  if (typeof email === "string" && email) {
    const { repository } = getInfra()
    const account = await repository.account.getOrCreate(email)
    ctx.setCookie("account-id", account.email)
    return redirectTo(redirectUrl)
  }
  return (
    <AuthPage>
      <AuthForm
        redirectTo={redirectUrl.href}
        errors={{
          email: email
            ? `Email "${email}" is invalid`
            : "Please provide an email",
        }}
      />
    </AuthPage>
  )
})
