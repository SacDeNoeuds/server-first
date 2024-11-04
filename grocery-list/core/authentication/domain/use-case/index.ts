import { defineUseCases, type DepsOf, type UseCasesOf } from "@/std/use-cases"
import { Authenticate } from "./authenticate"
import { SignInOrUp } from "./sign-in-or-up"

const useCasesToMake = {
  authenticate: Authenticate,
  signInOrUp: SignInOrUp,
}

export const useCase = {} as AuthUseCases

export type AuthUseCases = UseCasesOf<typeof useCasesToMake>
export function registerUseCases(deps: DepsOf<typeof useCasesToMake>) {
  defineUseCases(useCase, useCasesToMake, deps)
}
