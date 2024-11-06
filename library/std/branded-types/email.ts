import isEmail from "is-email"
import { pipe } from "../core"
import * as S from "../schema"
import * as entity from "./entity"

export type Email = entity.Value<string, "Email">
export const Email = pipe(
  S.string,
  S.refine("Email", isEmail),
  entity.fromSchema<Email>,
)
