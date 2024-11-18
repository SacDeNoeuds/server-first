import { Email, schema as S } from "@/std"
import { JsxHandler, redirectTo } from "@/std/web/server-handler"
import type { SignInOrUpCommand } from "@domain/authentication/domain/command/sign-in-or-up"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const SignInOrSignUpHandler = (command: {
  signInOrUp: SignInOrUpCommand
}) =>
  JsxHandler(async (ctx) => {
    const email = Email.schema.decode(ctx.body?.email)
    const hrefOrPath =
      ctx.url.searchParams.get("redirectTo") || ctx.getHeader("referer") || "/"
    const redirectUrl = new URL(hrefOrPath, ctx.url)

    if (!S.isFailure(email)) {
      const account = await command.signInOrUp(email.value)
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
