import { Email, schema as S } from "@/std"
import { type ServerHandler } from "@/std/web/server-handler"
import type { Account } from "@domain/authentication/domain"
import type { Authenticate } from "@domain/authentication/use-case/authenticate"
import type { JSX } from "jsx-server/jsx-runtime"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export type WithAuthWall = ReturnType<typeof WithAuthWall>
export const WithAuthWall =
  (useCase: { authenticate: Authenticate }) =>
  (
    handler: ServerHandler<JSX.Element, { account: Account }>,
  ): ServerHandler<JSX.Element, {}> =>
  async (ctx) => {
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
  }
