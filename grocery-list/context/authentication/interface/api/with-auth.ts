import type { HttpError } from "@/std/web/http-error"
import type {
  Handler,
  HandlerContext,
  Response,
} from "@/std/web/server-handler"
import type { Account } from "@domain/authentication/domain"

async function authenticateByApiKey(
  apiKey: string,
): Promise<Account | undefined> {
  return undefined
}

export function withAuth<A extends Response>(options: {
  handler: Handler<A, { account: Account }>
  error: (ctx: HandlerContext) => HttpError
}): Handler<A> {
  return async (ctx) => {
    const apiKey = ctx.getHeader("X-API-KEY")
    const account = apiKey && (await authenticateByApiKey(apiKey))

    return account ? options.handler({ ...ctx, account }) : options.error(ctx)
  }
}
