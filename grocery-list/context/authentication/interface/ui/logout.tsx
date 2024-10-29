import { redirectTo, type Handler } from "@/std/web/server-handler"

export const logout: Handler = async (ctx) => {
  ctx.setCookie("account-id", "", { maxAgeInSeconds: 0 })
  return redirectTo(new URL(ctx.getHeader("referer") ?? "/", ctx.url))
}
