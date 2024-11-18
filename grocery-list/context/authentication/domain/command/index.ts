import type { UseCasesOf } from "@/std/use-cases"
import { SignInOrUpCommand } from "./sign-in-or-up"

export const commands = {
  signInOrUp: SignInOrUpCommand,
}

export type Commands = UseCasesOf<typeof commands>
