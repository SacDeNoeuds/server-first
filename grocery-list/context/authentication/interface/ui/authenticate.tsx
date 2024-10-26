import { JsxHandler, redirectTo } from "@/std/server-handler"
import { useCase } from "../../domain"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const authenticate = JsxHandler(async (ctx) => {
  // exceptionally, no need for fancy parsing/decoding considering
  // we have just one property.
  const email = ctx.body?.email
  const hrefOrPath =
    ctx.url.searchParams.get("redirectTo") || ctx.getHeader("referer") || "/"
  const redirectUrl = new URL(hrefOrPath, ctx.url)

  if (typeof email === "string" && email) {
    const account = await useCase.signInOrUp(email)
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
