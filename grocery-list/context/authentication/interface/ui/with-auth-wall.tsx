import { JsxHandler, type Handler } from "@/std/server-handler"
import { useCase } from "../../domain/use-case"
import type { Account } from "../../main"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const withAuthWall = (
  handler: Handler<JSX.Element, { account: Account }>,
): Handler =>
  JsxHandler(async (ctx) => {
    const email = ctx.getCookie("account-id")
    const referrer = ctx.getHeader("referer")
    const account = email && (await useCase.authenticate(email))
    if (account) return handler({ ...ctx, account })

    return (
      <AuthPage>
        <AuthForm redirectTo={referrer} />
      </AuthPage>
    )
  })
