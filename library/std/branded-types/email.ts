import isEmail from "is-email"
import { pipe } from "../core"
import { schema as S } from "../schema"
import { EntityValue } from "./entity"
import type { Tagged } from "./tagged"

export type Email = Tagged<"Email", string>
export const Email = EntityValue<Email>("Email", {
  schema: pipe(S.string, S.refine("Email", isEmail)),
})
