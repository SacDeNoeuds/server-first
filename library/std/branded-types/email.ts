import isEmail from "is-email"
import { pipe } from "../core"
import { schema as S } from "../schema"
import type { Branded } from "./branded"
import { BrandedEntity } from "./entity"

export type Email = Branded<string, "Email">
export const Email = BrandedEntity<Email>("Email", {
  schema: pipe(S.string, S.refine("Email", isEmail)),
})
