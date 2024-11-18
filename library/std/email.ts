import isEmailFromLib from "is-email"
import type { branded } from "./branded-types"
import { pipe } from "./core"
import * as S from "./schema"

export type DisguisedEmail = branded.Type<string, "DisguisedEmail">
export type UniqueEmail = branded.Type<string, "UniqueEmail">
export type Email = DisguisedEmail | UniqueEmail

const disguisementRegex = /\+[A-z0-9]+@/

const isEmail = isEmailFromLib as (value: string) => value is Email

export const Email = {
  schema: pipe(S.string, S.refineTo("Email", isEmail)),
  from: (value: string) => S.unsafeDecode(value, Email.schema),
  isUnique: (value: Email): value is UniqueEmail => {
    return !disguisementRegex.test(value)
  },
  isDisguisedEmail: (value: Email): value is DisguisedEmail => {
    return disguisementRegex.test(value)
  },
  toUniqueEmail: (email: Email): UniqueEmail => {
    return email.replace(disguisementRegex, "") as UniqueEmail
  },
}
