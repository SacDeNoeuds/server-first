import { Email, schema as S } from "@/std"
import { type ServerHandler } from "@/std/web/server-handler"
import type { Account } from "@domain/authentication/domain"
import type { FindAccountByEmail } from "@domain/authentication/domain/query/find-account-by-email"
import type { JSX } from "jsx-server/jsx-runtime"
import { AuthForm } from "./components/auth-form"
import { AuthPage } from "./components/auth-page"

export type WithAuthWall = ReturnType<typeof WithAuthWall>
export const WithAuthWall =
  (query: { findAccountByEmail: FindAccountByEmail }) =>
  (
    handler: ServerHandler<JSX.Element, { account: Account }>,
  ): ServerHandler<JSX.Element, {}> =>
  async (ctx) => {
    const email = Email.schema.decode(ctx.getCookie("account-id"))
    const account =
      S.isSuccess(email) && (await query.findAccountByEmail(email.value))
    if (account) return handler({ ...ctx, account })

    const referrer = ctx.getHeader("referer")
    return (
      <AuthPage>
        <AuthForm redirectTo={referrer} />
      </AuthPage>
    )
  }
