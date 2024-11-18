import type { UseCasesOf } from "@/std/use-cases"
import { FindAccountByEmail } from "./find-account-by-email"

export const queries = {
  findAccountByEmail: FindAccountByEmail,
}

export type Queries = UseCasesOf<typeof queries>
