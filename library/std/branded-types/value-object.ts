import { pipe } from "../core"
import * as S from "../schema"
import * as branded from "./branded"

export interface Type<T extends branded.Type<unknown, any>> {
  from: (base: branded.BaseOf<T>) => T
  schema: S.Schema<T>
}

export function fromSchema<T extends branded.Type<unknown, any>>(
  schema: S.Schema<branded.BaseOf<T>>,
) {
  const from = branded.castAs<T>
  return {
    from,
    schema: pipe(schema, S.map(from)),
  }
}
