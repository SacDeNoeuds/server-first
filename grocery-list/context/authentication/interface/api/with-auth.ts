import type { HttpError } from "@/std/web/http-error"
import type {
  Response,
  ServerHandler,
  ServerHandlerContext,
} from "@/std/web/server-handler"
import type { Account } from "@domain/authentication/domain"

async function authenticateByApiKey(
  apiKey: string,
): Promise<Account | undefined> {
  return undefined
}

export function withAuth(error: (ctx: ServerHandlerContext) => HttpError) {
  return <A extends Response>(
    handler: ServerHandler<A, { account: Account }>,
  ): ServerHandler<A> => {
    return async (ctx) => {
      const apiKey = ctx.getHeader("X-API-KEY")
      const account = apiKey && (await authenticateByApiKey(apiKey))

      return account ? handler({ ...ctx, account }) : error(ctx)
    }
  }
}
