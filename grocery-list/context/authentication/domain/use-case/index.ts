import {
  defineUseCases,
  UseCasesProxy,
  type DepsOf,
  type UseCasesOf,
} from "@/std/use-cases"
import { Authenticate } from "./authenticate"
import { SignInOrUp } from "./sign-in-or-up"

const useCasesToMake = {
  authenticate: Authenticate,
  signInOrUp: SignInOrUp,
}

export const useCase = UseCasesProxy<AuthUseCases>("AuthUseCases")

export type AuthUseCases = UseCasesOf<typeof useCasesToMake>
export function registerUseCases(deps: DepsOf<typeof useCasesToMake>) {
  Object.assign(useCase, defineUseCases(useCasesToMake, deps))
}
