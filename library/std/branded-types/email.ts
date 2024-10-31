import isEmail from "is-email"
import { pipe } from "../core"
import { schema as S } from "../schema"
import * as entity from "./entity"

export type Email = entity.OfType<string>
export const Email = pipe(
  S.string,
  S.refine("Email", isEmail),
  entity.fromSchema<Email>,
)
