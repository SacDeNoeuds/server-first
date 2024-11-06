import { Email, schema as S } from "@/std"
import { JsxHandler, redirectTo } from "@/std/web/server-handler"
import type { SignInOrUp } from "@domain/authentication/use-case/sign-in-or-up"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const AuthenticateHandler = (useCase: { signInOrUp: SignInOrUp }) =>
  JsxHandler(async (ctx) => {
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
