import { Email } from "@/std"
import { schema as S } from "@/std/schema"
import { JsxHandler, redirectTo } from "@/std/web/server-handler"
import { useCase } from "../../domain"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const authenticate = JsxHandler(async (ctx) => {
  const email = Email.decode(ctx.body?.email)
  const hrefOrPath =
    ctx.url.searchParams.get("redirectTo") || ctx.getHeader("referer") || "/"
  const redirectUrl = new URL(hrefOrPath, ctx.url)

  if (!S.isFailure(email)) {
    const account = await useCase.signInOrUp(email.value)
    ctx.setCookie("account-id", account.email)
    return redirectTo(redirectUrl)
  }

  return (
    <AuthPage>
      <AuthForm
        redirectTo={redirectUrl.href}
        errors={{
          email: ctx.body?.email
            ? `Email "${ctx.body.email}" is invalid`
            : "Please provide an email",
        }}
      />
    </AuthPage>
  )
})
