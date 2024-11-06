import type { UseCasesOf } from "@/std/use-cases"
import { Authenticate } from "./authenticate"
import { SignInOrUp } from "./sign-in-or-up"

export const useCases = {
  authenticate: Authenticate,
  signInOrUp: SignInOrUp,
}

export type UseCases = UseCasesOf<typeof useCases>
