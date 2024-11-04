import { Email } from "@/std"
import { schema as S } from "@/std/schema"
import { JsxHandler, type Handler } from "@/std/web/server-handler"
import type { JSX } from "jsx-server/jsx-runtime"
import { useCase, type Account } from "../../domain"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const withAuthWall = (
  handler: Handler<JSX.Element, { account: Account }>,
): Handler =>
  JsxHandler(async (ctx) => {
    const email = Email.decode(ctx.getCookie("account-id"))
    const account =
      S.isSuccess(email) && (await useCase.authenticate(email.value))
    if (account) return handler({ ...ctx, account })

    const referrer = ctx.getHeader("referer")
    return (
      <AuthPage>
        <AuthForm redirectTo={referrer} />
      </AuthPage>
    )
  })
