import { redirectTo, type ServerHandler } from "@/std/web/server-handler"

export const logoutHandler: ServerHandler = async (ctx) => {
  ctx.setCookie("account-id", "", { maxAgeInSeconds: 0 })
  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
}
