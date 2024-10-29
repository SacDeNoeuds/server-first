import { std } from "@/std"
import { schema } from "@/std/schema"
import { JsxHandler, type Handler } from "@/std/web/server-handler"
import { useCase, type Account } from "../../domain"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export const withAuthWall = (
  handler: Handler<JSX.Element, { account: Account }>,
): Handler =>
  JsxHandler(async (ctx) => {
    const email = std.Email.decode(ctx.getCookie("account-id"))
    const referrer = ctx.getHeader("referer")
    const account =
      schema.isSuccess(email) && (await useCase.authenticate(email.value))
    if (account) return handler({ ...ctx, account })

    return (
      <AuthPage>
        <AuthForm redirectTo={referrer} />
      </AuthPage>
    )
  })
