import isEmail from "is-email"
import { pipe } from "../core"
import * as S from "../schema"
import * as valueObject from "./value-object"

export type Email = valueObject.Of<string, "Email">
export const Email = pipe(
  S.string,
  S.refine("Email", isEmail),
  valueObject.fromSchema<Email>,
)
